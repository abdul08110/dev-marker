import { RootState } from '@/stores';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import mqtt from 'mqtt';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import useTimer from './useTimer';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/stores/types';
import { getTimeLeftInMinutes } from '@/utils/functions';
import useOrientation from './useOrientation';

export interface ScoreBoardState {
  matchId: string;
  sport: 'BILLIARDS' | 'SNOOKER';
  sideOnePlayerOne: Player;
  sideOnePlayerTwo: Player | null;
  sideTwoPlayerOne: Player;
  sideTwoPlayerTwo: Player | null;
  activePlayerId: string | null;
  teamOneScore: number;
  teamTwoScore: number;
  currentSetTeamOneScore: number;
  currentSetTeamTwoScore: number;
  activePlayerTurnScore: number;
}

const useScoreboard = () => {
  // REDUX STATE
  const clubs = useSelector((state: RootState) => state.club);

  // HOOKS
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsMatchId = searchParams.get('matchId');
  const { timeLeft, startTimer, setTimeLeft } = useTimer(30, () => {
    // Logic to handle when timer completes
  });
  const orientation = useOrientation();

  // API
  const getLiveMatchHook = useGetMatchLiveData();

  // LOCAL STATE
  const [loading, setLoading] = React.useState<boolean>(false);
  const [scoreBoardData, setScoreboardData] = React.useState<ScoreBoardState | null>(null);

  // USE EFFECT
  useEffect(() => {
    fetchMatchData(searchParamsMatchId);
  }, [searchParamsMatchId]);

  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  useEffect(() => {
    if (!clubs.activeClub) return;

    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const topics = [
      `${clubs.activeClub.venueId}/send-data`,
      `${clubs.activeClub.venueId}/match-start`,
      `${clubs.activeClub.venueId}/match-end`,
    ];

    const mqttClient = mqtt.connect(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 2000,
    });

    mqttClient.on('connect', () => {
      topics.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
          if (err) console.error(`Subscription error for topic ${topic}: ${err.message}`);
          else console.log(`connected to topic ${topic}`);
        });
      });
    });

    mqttClient.on('message', (topic, message) => {
      handleNewMessage(topic, message.toString());
    });

    mqttClient.on('reconnect', () => {
      console.log('Attempting to reconnect to MQTT broker');
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT Error:', err);
      mqttClient.end();
    });

    mqttClient.on('close', () => {
      console.log('Disconnected from MQTT broker');
    });
  }, [clubs.activeClub]);

  // HANDLERS
  const fetchMatchData = async (matchId: string | null) => {
    if (matchId) {
      setLoading(true);
      try {
        const res = await getLiveMatchHook.getLiveMatchData({ matchId });

        if (res !== null) {
          const activeSet = res.sets[res.sets.length - 1];
          const activeTurn = activeSet ? activeSet.turns[activeSet.turns.length - 1] : null;

          setScoreboardData({
            matchId: matchId,
            sport: res.sport,
            sideOnePlayerOne: res.sideOnePlayerOne,
            sideTwoPlayerOne: res.sideTwoPlayerOne,
            sideOnePlayerTwo: res.sideOnePlayerTwo,
            sideTwoPlayerTwo: res.sideTwoPlayerTwo,
            activePlayerId: res.activePlayerId,
            teamOneScore: res.teamOneScore,
            teamTwoScore: res.teamTwoScore,
            currentSetTeamOneScore: res.currentSetTeamOneScore,
            currentSetTeamTwoScore: res.currentSetTeamTwoScore,
            activePlayerTurnScore: activeTurn && activeTurn.score ? activeTurn.score : 0,
          });

          setTimeLeft(Math.round(getTimeLeftInMinutes(res.expectedEndTimeDate) * 60));
          startTimer();
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load match data. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load match data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleNewMessage = async (topic: string, message: string) => {
    const parsedMessage = JSON.parse(message);
    const topicWithoutId = topic.split('/')[1];

    switch (topicWithoutId) {
      case 'send-data':
        if (scoreBoardData !== null) {
          setScoreboardData({
            ...scoreBoardData!,
            activePlayerId: parsedMessage.activePlayerId,
            activePlayerTurnScore: parsedMessage.activePlayerTurnScore,
            currentSetTeamOneScore: parsedMessage.currentSetTeamOneScore,
            currentSetTeamTwoScore: parsedMessage.currentSetTeamTwoScore,
            teamOneScore: parsedMessage.teamOneScore,
            teamTwoScore: parsedMessage.teamTwoScore,
          });
        }
        break;
      case 'match-start':
        const matchId = parsedMessage.matchId;
        await fetchMatchData(matchId);
        break;
      case 'match-end':
        setScoreboardData(null);
        break;
    }
  };

  return {
    loading,
    scoreBoardData,
    timeLeft,
    orientation,
  };
};

export default useScoreboard;
