import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import useGetMatchLiveData, { StreamData, StreamType } from '@/api/app/useGetMatchData';
import { Player, Set, TournamentItem, TournamentPhase, TournamentSubItem } from '@/stores/types';
import useTimer from './useTimer';
import { StreamState } from './useStreaming';

export interface StreamingState {
  matchId: string;
  sport: 'BILLIARDS' | 'SNOOKER';
  sportType: 'SNOOKER_10_RED' | 'SNOOKER_15_RED' | 'SNOOKER_6_RED';
  sideOnePlayerOne: Player;
  sideOnePlayerTwo: Player | null;
  sideTwoPlayerOne: Player;
  sideTwoPlayerTwo: Player | null;
  activePlayerId: string | null;
  teamOneScore: number;
  teamTwoScore: number;
  streamType?: StreamType;
  streamData?: StreamData;
  matchStatus: 'LIVE' | 'COMPLETED';
  sets: Set[];
  overlayType?: 'SOURCE' | 'DESTINATION' | 'SOURCE_WITH_FINAL_SCORES';
  showPlayerMatchHistory?: boolean;
  venueNo: number | null;
  clubName: string | null;
  noOfFrames: number | null;
  actualStartTimeDate: string;
  actualEndTimeDate: string | null;
  clubLogo: string | null;
  tournamentLogo: string | null;
  teamOneLogo: string | null;
  teamTwoLogo: string | null;
  tournamentTeamOneScore: number | null;
  tournamentTeamTwoScore: number | null;
  tournamentTeamOneabb: string | null;
  tournamentTeamTwoabb: string | null;
  teamOneHandicap: number | null;
  teamTwoHandicap: number | null;
  handicap: number;
  maxScorePerSet: number | null;
  isTeamOneHandicapApplied?: boolean;
  isTeamTwoHandicapApplied?: boolean;
  tournamentName: string | null;
  tournamentId: string | null;
  teamOneName: string | null;
  teamTwoName: string | null;
  tournamentTeamOneId: string | null;
  tournamentTeamTwoId: string | null;
  format: string | null;
  expectedEndTimeDate: string | null;
  tournamentSubItem?: TournamentSubItem & {
    tournamentItem: TournamentItem & {
      tournamentPhase: TournamentPhase & {
        tournamentFormats: [
          {
            id: string;
          }
        ]
      };
    };
  };
  streams: StreamState[];
}

const useLiveScoring = (matchId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingData, setStreamingData] = useState<StreamingState | null>(null);
  const getLiveMatchHook = useGetMatchLiveData();
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
  const timeLeft = useTimer({
    endTime: streamingData && streamingData.expectedEndTimeDate ? new Date(streamingData.expectedEndTimeDate) : null,
    startTime:
      streamingData && streamingData.matchStatus === 'COMPLETED' ? new Date(streamingData.actualStartTimeDate) : null,
    onTimerComplete: () => {},
  });

  const streamingDataRef = useRef<StreamingState | null>(null);
  const timeLeftRef = useRef<number>(timeLeft);

  const connectToMqtt = (topics: string[]) => {
    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    mqttClientRef.current = mqtt.connect(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 2000,
    });

    mqttClientRef.current.on('connect', () => {
      console.log('Connected to MQTT broker');
      topics.forEach((topic) => {
        mqttClientRef.current?.subscribe(topic, (err) => {
          if (err) console.error(`Subscription error for topic ${topic}: ${err.message}`);
          else console.log(`Subscribed to topic ${topic}`);
        });
      });
    });

    mqttClientRef.current.on('message', (topic, message) => {
      handleNewMessage(topic, message.toString());
    });

    mqttClientRef.current.on('error', (err) => {
      console.error('MQTT Error:', err);
      mqttClientRef.current?.end();
    });

    mqttClientRef.current.on('close', () => {
      console.log('Disconnected from MQTT broker');
    });
  };

  useEffect(() => {
    streamingDataRef.current = streamingData;
  }, [streamingData]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (!matchId || matchId.trim() === '') {
      return;
    }

    fetchMatchData(matchId);

    return () => {
      mqttClientRef.current?.end();
    };
  }, [matchId]);

  const fetchMatchData = async (matchId: string) => {
    setLoading(true);
    try {
      const res = await getLiveMatchHook.getLiveMatchData({ matchId });

      if (res) {
        const initialData = {
          matchId: matchId,
          sport: res.sport,
          sideOnePlayerOne: res.sideOnePlayerOne,
          sideTwoPlayerOne: res.sideTwoPlayerOne,
          sideOnePlayerTwo: res.sideOnePlayerTwo,
          sideTwoPlayerTwo: res.sideTwoPlayerTwo,
          activePlayerId: res.activePlayerId,
          teamOneScore: res.teamOneScore,
          teamTwoScore: res.teamTwoScore,
          sets: res.sets,
          matchStatus: res.matchStatus,
          streamType: res.streamType,
          streamData: res.streamData,
          venueNo: res.venue ? res.venue.no : null,
          clubName: res.club ? res.club.name : null,
          noOfFrames: res.noOfSets,
          actualStartTimeDate: res.actualStartTimeDate,
          overlayType: res.overlayType,
          actualEndTimeDate: res.actualEndTimeDate,
          clubLogo: res.club && res.club.imageUrl ? res.club.imageUrl : null,
          tournamentLogo: res.tournament && res.tournament.logo ? res.tournament.logo : null,
          teamOneLogo: res.tournamentTeamOne && res.tournamentTeamOne.logo ? res.tournamentTeamOne.logo : null,
          teamTwoLogo: res.tournamentTeamTwo && res.tournamentTeamTwo.logo ? res.tournamentTeamTwo.logo : null,
          tournamentTeamOneScore: res.tournamentTeamOneScore ? res.tournamentTeamOneScore : null,
          tournamentTeamTwoScore: res.tournamentTeamTwoScore ? res.tournamentTeamTwoScore : null,
          tournamentTeamOneabb: res.tournamentTeamOne && res.tournamentTeamOne.code ? res.tournamentTeamOne.code : null,
          tournamentTeamTwoabb: res.tournamentTeamTwo && res.tournamentTeamTwo.code ? res.tournamentTeamTwo.code : null,
          teamOneHandicap: res.teamOneHandicap ? res.teamOneHandicap : null,
          teamTwoHandicap: res.teamTwoHandicap ? res.teamTwoHandicap : null,
          sportType: res.sportType,
          handicap: res.handicap,
          maxScorePerSet: res.maxScorePerSet,
          isTeamOneHandicapApplied: res.isTeamOneHandicapApplied,
          isTeamTwoHandicapApplied: res.isTeamTwoHandicapApplied,
          tournamentName: res.tournament ? res.tournament.name : null,
          tournamentId: res.tournament ? res.tournament.id : null,
          teamOneName: res.tournamentTeamOne ? res.tournamentTeamOne.name : null,
          teamTwoName: res.tournamentTeamTwo ? res.tournamentTeamTwo.name : null,
          expectedEndTimeDate: res.expectedEndTimeDate ? res.expectedEndTimeDate : null,
          format: res.format ? res.format : null,
          tournamentSubItem: res.tournamentSubItem,
          tournamentTeamOneId: res.tournamentTeamOneId ? res.tournamentTeamOneId : null,
          tournamentTeamTwoId: res.tournamentTeamTwoId ? res.tournamentTeamTwoId : null,
          streams: []
        };

        setStreamingData(initialData);

        if (res.matchStatus === 'LIVE') {
          const venueTopics = [`${res.venueId}/send-data`, `${res.venueId}/match-end`, `${res.venueId}/live-static-match-data`];
          connectToMqtt(venueTopics);
        }
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (topic: string, message: string) => {
    const parsedMessage = JSON.parse(message);
    const topicWithoutId = topic.split('/')[1];

    switch (topicWithoutId) {
      case 'send-data':
        setStreamingData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            activePlayerId: parsedMessage.activePlayerId,
            teamOneScore: parsedMessage.teamOneScore,
            teamTwoScore: parsedMessage.teamTwoScore,
            sets: parsedMessage.sets || prevData.sets,
          };
        });
        break;
      case 'live-static-match-data':
        setStreamingData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            tournamentTeamOneScore: parsedMessage.teamOneScore,
            tournamentTeamTwoScore: parsedMessage.teamTwoScore,
            tournamentSubItem: prevData.tournamentSubItem ? {
              ...prevData.tournamentSubItem,
              tournamentItem: {
                ...prevData.tournamentSubItem.tournamentItem,
                tournamentTeamOneCumulativeFinalFrameScore: parsedMessage.teamOneCumulativeFinalFrameScore,
                tournamentTeamTwoCumulativeFinalFrameScore: parsedMessage.teamTwoCumulativeFinalFrameScore,
                tournamentTeamOneLastestGameHandicap: parsedMessage.teamOneLastestGameHandicap,
                tournamentTeamTwoLastestGameHandicap: parsedMessage.teamTwoLastestGameHandicap,
              }
            } : prevData.tournamentSubItem,
          };
        });
        break;
      case 'match-end':
        setStreamingData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            matchStatus: 'COMPLETED',
            actualEndTimeDate: new Date().toISOString()
          };
        });
        break;
    }
  };

  return {
    loading,
    streamingData,
    timeLeft,
  };
};

export default useLiveScoring;
