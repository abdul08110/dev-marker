import React, { useEffect } from 'react';
import mqtt from 'mqtt';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import useTimer from './useTimer';
import { toast } from '@/components/ui/use-toast';
import { Player, Set } from '@/stores/types';
import useBodyRotation from './useBodyRotation';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';

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
  sets: Set[];
  actualStartTime: string | null;
  expectedEndTimeDate: string | null;
  teamOneLogo: string | null;
  teamTwoLogo: string | null;
  tournamentId: string | null;
  tournamentTeamOneScore: number | null;
  tournamentTeamTwoScore: number | null;
  teamOneHandicap: number | null;
  teamTwoHandicap: number | null;
  isTeamOneHandicapApplied?: boolean;
  isTeamTwoHandicapApplied?: boolean;
  maxScorePerSet: number | null;
  tournamentTeamOneName: string | null;
  tournamentTeamTwoName: string | null;
  actualStartTimeDate: string;
  clubLogo: string | null;
  format: string | null;
  venueNo: number | null;
}

const useScoreboardRender = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsVenueId = searchParams.get('venueId');

  const getLiveMatchHook = useGetMatchLiveData();
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [scoreBoardData, setScoreboardData] = React.useState<ScoreBoardState | null>(null);
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('landscape');
  const [showTimeOverAlert, setShowTimeOverAlert] = React.useState<boolean>(false);
  const { rotateBody } = useBodyRotation();

  const timeLeft = useTimer({
    endTime: scoreBoardData && scoreBoardData.expectedEndTimeDate ? new Date(scoreBoardData.expectedEndTimeDate) : null,
    startTime: null,
    onTimerComplete: () => {
      setShowTimeOverAlert(true);
    },
  });

  useEffect(() => {
    if (!searchParamsVenueId) return;

    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const topics = [
      `${searchParamsVenueId}/send-data`,
      `${searchParamsVenueId}/match-start`,
      `${searchParamsVenueId}/match-end`,
      `${searchParamsVenueId}/timer-updated`,
    ];

    checkIfLiveMatchAndfetchMatchData(searchParamsVenueId, null);

    const connectToMqtt = () => {
      const mqttClient = mqtt.connect(brokerUrl, {
        keepalive: 60,
        reconnectPeriod: 2000,
      });

      mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        topics.forEach((topic) => {
          mqttClient.subscribe(topic, (err) => {
            if (err) console.error(`Subscription error for topic ${topic}: ${err.message}`);
            else console.log(`Subscribed to topic ${topic}`);
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
        console.log('Disconnected from MQTT broker. Reconnecting...');
        setTimeout(connectToMqtt, 2000); // Reconnect explicitly after a delay
      });

      return mqttClient;
    };

    const mqttClient = connectToMqtt();

    return () => {
      mqttClient.end();
    };
  }, [searchParamsVenueId, navigate]);

  const checkIfLiveMatchAndfetchMatchData = async (venueId: string | null, matchId: string | null) => {
    setLoading(true);
    let localMatchId = matchId;

    if (venueId) {
      const liveMatchByVenueResponse = await getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(venueId);
      if (liveMatchByVenueResponse) {
        localMatchId = liveMatchByVenueResponse.matchId!;
      }
    }

    if (localMatchId) {
      try {
        const res = await getLiveMatchHook.getLiveMatchData({ matchId: localMatchId });

        if (res !== null) {
          setScoreboardData({
            matchId: localMatchId,
            sport: res.sport,
            sideOnePlayerOne: res.sideOnePlayerOne,
            sideTwoPlayerOne: res.sideTwoPlayerOne,
            sideOnePlayerTwo: res.sideOnePlayerTwo,
            sideTwoPlayerTwo: res.sideTwoPlayerTwo,
            activePlayerId: res.activePlayerId,
            teamOneScore: res.teamOneScore,
            teamTwoScore: res.teamTwoScore,
            sets: res.sets,
            actualStartTime: res.actualStartTimeDate,
            expectedEndTimeDate: res.expectedEndTimeDate ? res.expectedEndTimeDate : null,
            teamOneLogo: res.tournamentTeamOne ? res.tournamentTeamOne.logo : null,
            teamTwoLogo: res.tournamentTeamTwo ? res.tournamentTeamTwo.logo : null,
            tournamentId: res.tournament ? res.tournament.id : null,
            tournamentTeamOneScore: res.tournamentTeamOneScore ? res.tournamentTeamOneScore : null,
            tournamentTeamTwoScore: res.tournamentTeamTwoScore ? res.tournamentTeamTwoScore : null,
            teamOneHandicap: res.teamOneHandicap ? res.teamOneHandicap : null,
            teamTwoHandicap: res.teamTwoHandicap ? res.teamTwoHandicap : null,
            isTeamOneHandicapApplied: res.isTeamOneHandicapApplied,
            isTeamTwoHandicapApplied: res.isTeamTwoHandicapApplied,
            maxScorePerSet: res.maxScorePerSet,
            tournamentTeamOneName: res.tournamentTeamOne ? res.tournamentTeamOne.name : null,
            tournamentTeamTwoName: res.tournamentTeamTwo ? res.tournamentTeamTwo.name : null,
            actualStartTimeDate: res.actualStartTimeDate,
            clubLogo: res.club && res.club.imageUrl ? res.club.imageUrl : null,
            format: res.format,
            venueNo: res.venue ? res.venue.no : null
          });
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
    }

    setLoading(false);
  };

  const handleNewMessage = async (topic: string, message: string) => {
    const parsedMessage = JSON.parse(message);
    const topicWithoutId = topic.split('/')[1];

    console.log(`THE TOPIC IS ${topic}`);

    switch (topicWithoutId) {
      case 'send-data':
        setScoreboardData((prevData) => {
          if (prevData === null) return null;
          const updatedSets = parsedMessage.sets ? [...parsedMessage.sets] : prevData.sets;

          return {
            ...prevData,
            activePlayerId: parsedMessage.activePlayerId,
            teamOneScore: parsedMessage.teamOneScore,
            teamTwoScore: parsedMessage.teamTwoScore,
            sets: updatedSets,
            isTeamOneHandicapApplied: parsedMessage.isTeamOneHandicapApplied,
            isTeamTwoHandicapApplied: parsedMessage.isTeamTwoHandicapApplied,
          };
        });
        break;
      case 'match-start':
        const matchId = parsedMessage.matchId;
        setShowTimeOverAlert(false);
        await checkIfLiveMatchAndfetchMatchData(null, matchId);
        break;
      case 'match-end':
        setScoreboardData(null);
        setShowTimeOverAlert(false);
        break;
      case 'timer-updated':
        const newExpectedEndDateTime = parsedMessage.expectedEndTimeDate;
        setScoreboardData((prevData) => {
          if (prevData === null) return null;

          return {
            ...prevData,
            expectedEndTimeDate: newExpectedEndDateTime,
          };
        });
        setShowTimeOverAlert(false);
        break;
    }
  };

  return {
    loading,
    scoreBoardData,
    timeLeft,
    orientation,
    setOrientation,
    rotateBody,
    showTimeOverAlert,
  };
};

export default useScoreboardRender;
