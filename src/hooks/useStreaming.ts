import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import useGetMatchLiveData, { StreamData, StreamType } from '@/api/app/useGetMatchData';
import { toast } from '@/components/ui/use-toast';
import { Player, Set } from '@/stores/types';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import useTimer from './useTimer';
import { addMillisecondsToUTC, getTimeDifferenceInMinutes, getTimeLeftInMinutes } from '@/utils/functions';
import { calculatePointsBySide, calculateTotalTeamScore } from '@/stores/selectors/commonSport';

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
  venueNo: number;
  clubName: string;
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
}

const useStreaming = (venueId?: string, matchId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingData, setStreamingData] = useState<StreamingState | null>(null);
  const [viewershipData, setViewershipData] = useState<StreamingState | null>(null);
  const getLiveMatchHook = useGetMatchLiveData();
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
  const { timeLeft, startTimer, setTimeLeft } = useTimer(0, () => {
    // Logic to handle when timer completes
  });
  const scoreCheckIntervalRef = useRef<number | null>(null);
  const streamingDataRef = useRef<StreamingState | null>(null);
  const timeLeftRef = useRef<number>(timeLeft);
  const [currentTime, setCurrentTime] = useState(0);

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
    if (matchId) {
      fetchMatchData(matchId);
    } else if (venueId) {
      fetchActiveMatchForVenue(venueId);
      const topics = [`${venueId}/send-data`, `${venueId}/match-start`, `${venueId}/match-end`];
      connectToMqtt(topics);
    }

    return () => {
      mqttClientRef.current?.end();
    };
  }, [venueId, matchId]);

  const fetchMatchData = async (matchId: string) => {
    setLoading(true);
    try {
      const res = await getLiveMatchHook.getLiveMatchData({ matchId });

      if (res) {
        setStreamingData(null);
        setStreamingData({
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
          venueNo: res.venue.no,
          clubName: res.club.name,
          noOfFrames: res.noOfSets,
          actualStartTimeDate: res.actualStartTimeDate,
          overlayType: res.overlayType,
          actualEndTimeDate: res.actualEndTimeDate,
          clubLogo: res.club.imageUrl ? res.club.imageUrl : null,
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
        });

        if (res.matchStatus === 'LIVE') {
          if (res.expectedEndTimeDate) {
            setTimeLeft(Math.round(getTimeLeftInMinutes(res.expectedEndTimeDate) * 60));
          }
        } else if (res.matchStatus === 'COMPLETED') {
          const timeDifference = getTimeDifferenceInMinutes(res.actualStartTimeDate, res.actualEndTimeDate!);
          setTimeLeft(timeDifference * 60);
        }

        setViewershipData({
          matchId: matchId,
          sport: res.sport,
          sideOnePlayerOne: res.sideOnePlayerOne,
          sideTwoPlayerOne: res.sideTwoPlayerOne,
          sideOnePlayerTwo: res.sideOnePlayerTwo,
          sideTwoPlayerTwo: res.sideTwoPlayerTwo,
          activePlayerId: null,
          teamOneScore: res.matchStatus === 'LIVE' ? res.teamOneScore : 0,
          teamTwoScore: res.matchStatus === 'LIVE' ? res.teamTwoScore : 0,
          sets: res.matchStatus === 'LIVE' ? res.sets : [],
          matchStatus: res.matchStatus,
          streamType: res.streamType,
          streamData: res.streamData,
          venueNo: res.venue.no,
          clubName: res.club.name,
          noOfFrames: res.noOfSets,
          actualStartTimeDate: res.actualStartTimeDate,
          overlayType: res.overlayType,
          actualEndTimeDate: res.actualEndTimeDate,
          clubLogo: res.club.imageUrl ? res.club.imageUrl : null,
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
        });

        if (res.matchStatus === 'LIVE' && !venueId) {
          const venueTopics = [`${res.venueId}/send-data`, `${res.venueId}/match-end`];
          connectToMqtt(venueTopics);
        }
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
  };

  const fetchActiveMatchForVenue = async (venueId: string) => {
    setLoading(true);
    try {
      const res = await getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(venueId);
      if (res && res.matchId) {
        fetchMatchData(res.matchId);
      } else {
        setStreamingData(null);
      }
    } catch (error) {
      console.error('Error fetching active match data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load active match data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (topic: string, message: string) => {
    const parsedMessage = JSON.parse(message);
    const topicWithoutId = topic.split('/')[1];

    let currentStreamingData = structuredClone(streamingDataRef.current);

    switch (topicWithoutId) {
      case 'send-data':
        setStreamingData((prevData) => {
          if (prevData === null) return null;
          return {
            ...prevData,
            activePlayerId: parsedMessage.activePlayerId,
            teamOneScore: parsedMessage.teamOneScore,
            teamTwoScore: parsedMessage.teamTwoScore,
            sets: parsedMessage.sets || prevData.sets,
          };
        });
        break;
      case 'match-start':
        fetchActiveMatchForVenue(venueId!);
        break;
      case 'match-end':
        if (currentStreamingData!.streamType === StreamType.CLOUD_PROVIDER) {
          window.setTimeout(() => {
            startTimer();
            setStreamingData(null);
            setViewershipData(null);

            if (scoreCheckIntervalRef.current !== null) {
              window.clearInterval(scoreCheckIntervalRef!.current);
              scoreCheckIntervalRef.current = null;
            }
          }, 20000);
        }
        break;
    }
  };

  const handlePlayBackScoreCheck = (currentTime: number) => {
    const currentStreamingData = structuredClone(streamingDataRef.current);

    if (currentStreamingData) {
      const currentScoreTime = addMillisecondsToUTC(currentStreamingData.actualStartTimeDate, currentTime);

      let consideredSets = currentStreamingData!.sets
        .filter((value) => new Date(value.turns[0].timeScored) <= new Date(currentScoreTime))
        .map((set) => ({ ...set, turns: [...set.turns] }));

      let lastSet = { ...consideredSets[consideredSets.length - 1] };
      lastSet.status = 'ONGOING';

      let consideredTurns = lastSet.turns
        .filter((value) => new Date(value.timeScored) <= new Date(currentScoreTime))
        .map((turn) => ({ ...turn, points: [...turn.points] }));

      let lastTurn = { ...consideredTurns[consideredTurns.length - 1] };

      let activePlayerId = lastTurn.turnPlayerId;
      let consideredPoints = lastTurn.points.filter(
        (value) => new Date(value.timeScored) <= new Date(currentScoreTime),
      );

      const totalLastTurnScore = consideredPoints.reduce((totalScore, point) => {
        if (point.snookerPoint) {
          return totalScore + point.snookerPoint.score;
        }

        if (point.billiardsPoint) {
          return totalScore + point.billiardsPoint.score;
        }

        return totalScore;
      }, 0);

      lastTurn.score = totalLastTurnScore;
      lastTurn.points = consideredPoints;

      consideredTurns[consideredTurns.length - 1] = lastTurn;
      lastSet.turns = consideredTurns;

      consideredSets[consideredSets.length - 1] = lastSet;

      const teamScoresForCurrentSet = calculatePointsBySide(
        consideredTurns,
        currentStreamingData?.sideOnePlayerOne,
        currentStreamingData?.sideOnePlayerTwo,
        currentStreamingData?.sideTwoPlayerOne,
        currentStreamingData?.sideTwoPlayerTwo,
        currentStreamingData?.handicap,
      );

      consideredSets[consideredSets.length - 1] = {
        ...consideredSets[consideredSets.length - 1],
        teamOneScore: teamScoresForCurrentSet.side1,
        teamTwoScore: teamScoresForCurrentSet.side2,
      };

      const totalTeamScores = calculateTotalTeamScore(consideredSets);

      if (currentStreamingData!.streamType === StreamType.CLOUD_PROVIDER) {
        setViewershipData({
          matchId: currentStreamingData.matchId,
          sport: currentStreamingData.sport,
          sideOnePlayerOne: currentStreamingData.sideOnePlayerOne,
          sideTwoPlayerOne: currentStreamingData.sideTwoPlayerOne,
          sideOnePlayerTwo: currentStreamingData.sideOnePlayerTwo,
          sideTwoPlayerTwo: currentStreamingData.sideTwoPlayerTwo,
          activePlayerId: activePlayerId,
          teamOneScore: totalTeamScores.side1,
          teamTwoScore: totalTeamScores.side2,
          sets: consideredSets,
          matchStatus: currentStreamingData.matchStatus,
          streamType: currentStreamingData.streamType,
          streamData: currentStreamingData.streamData,
          venueNo: currentStreamingData.venueNo,
          clubName: currentStreamingData.clubName,
          noOfFrames: currentStreamingData.noOfFrames,
          actualStartTimeDate: currentStreamingData.actualStartTimeDate,
          overlayType: currentStreamingData.overlayType,
          actualEndTimeDate: currentStreamingData.actualEndTimeDate,
          clubLogo: currentStreamingData.clubLogo,
          tournamentLogo: currentStreamingData.tournamentLogo,
          teamOneLogo: currentStreamingData.teamOneLogo,
          teamTwoLogo: currentStreamingData.teamTwoLogo,
          tournamentTeamOneScore: currentStreamingData.tournamentTeamOneScore,
          tournamentTeamTwoScore: currentStreamingData.tournamentTeamTwoScore,
          tournamentTeamOneabb: currentStreamingData.tournamentTeamOneabb,
          tournamentTeamTwoabb: currentStreamingData.tournamentTeamTwoabb,
          teamOneHandicap: currentStreamingData.teamOneHandicap,
          teamTwoHandicap: currentStreamingData.teamTwoHandicap,
          sportType: currentStreamingData.sportType,
          handicap: currentStreamingData.handicap,
        });
      }
    }
  };

  const onVideoEnd = () => {
    setStreamingData(null);
    setViewershipData(null);
    setCurrentTime(0);
  };

  const updateTime = async (timeInMillseconds: number) => {
    await setCurrentTime(timeInMillseconds);
    await handlePlayBackScoreCheck(timeInMillseconds);
  };

  return {
    loading,
    streamingData,
    timeLeft,
    viewershipData,
    onVideoEnd,
    currentTime,
    updateTime,
  };
};

export default useStreaming;
