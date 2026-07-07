import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import useGetMatchLiveData, { StreamType } from '@/api/app/useGetMatchData';
import { toast } from '@/components/ui/use-toast';
import { Player, Set, StopClockState, TournamentItem, TournamentPhase, TournamentSubItem } from '@/stores/types';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import useTimer from './useTimer';
import { addMillisecondsToUTC } from '@/utils/functions';
import { calculatePointsBySide, calculateTotalTeamScore } from '@/stores/selectors/commonSport';
import useGetMatchStreams from '@/api/app/useGetStreamInfoMarker';
import useGetSponsorshipVideo from '@/api/app/useGetSponsorshipVideo';
import useGetLineup from '@/api/app/useGetLineup';
import { LineupResponse } from '@/api/app/types/lineup';

const LINEUP_DISPLAY_MS = 30_000;

export interface StreamState {
  streamType: StreamType;
  streamProvider: 'YOUTUBE' | 'MUX';
  streamUrl?: string;
  isPrimary: boolean;
  brodcastId?: string;
  overlayType: 'SOURCE' | 'DESTINATION' | 'SOURCE_WITH_FINAL_SCORES';
}

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
  matchStatus: 'LIVE' | 'COMPLETED';
  sets: Set[];
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
  tournamentPhaseId?: string | null;
  format: string | null;
  eventFormat: 'SINGLES' | 'TEAMS';
  expectedEndTimeDate: string | null;
  showFormatsAsGameNumber: boolean | null;
  showCummulativeScoreInCombination: boolean | null;
  showLatestHandicapInCombination: boolean | null;
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
  phase: string | null;
  streams: StreamState[];
  isStopClockEnabled?: boolean;
  stopClockFrameTimeInSeconds?: number;
  stopClockTurnTimeInSeconds?: number;
  stopClockVoiceEnabled?: boolean;
  stopClockState?: StopClockState | null;
}

const useStreaming = (venueId?: string, matchId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingData, setStreamingData] = useState<StreamingState | null>(null);
  const [viewershipData, setViewershipData] = useState<StreamingState | null>(null);
  const getLiveMatchHook = useGetMatchLiveData();
  const getMatchStreamsHook = useGetMatchStreams();
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
  const getSponsorshipVideoHook = useGetSponsorshipVideo();
  const getLineupHook = useGetLineup();
  const [lineupData, setLineupData] = useState<LineupResponse | null>(null);
  const [showLineup, setShowLineup] = useState(false);
  const [lineupClubInfo, setLineupClubInfo] = useState<{ clubName: string | null; clubLogo: string | null }>({ clubName: null, clubLogo: null });
  const lineupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
  const lastStopClockTurnStartedAtRef = useRef<string | null>(null);
  const timeLeft = useTimer({
    endTime: streamingData && streamingData.expectedEndTimeDate ? new Date(streamingData.expectedEndTimeDate) : null,
    startTime:
      streamingData && streamingData.matchStatus === 'COMPLETED' ? new Date(streamingData.actualStartTimeDate) : null,
    onTimerComplete: () => {},
  });
  const [sponsorshipVideoUrl, setSponsorshipVideoUrl] = useState<string | null>(null);

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

  const clearLineup = () => {
    if (lineupTimerRef.current) clearTimeout(lineupTimerRef.current);
    lineupTimerRef.current = null;
    setShowLineup(false);
    setLineupData(null);
  };

  useEffect(() => {
    return () => clearLineup();
  }, []);

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
      const topics = [
        `${venueId}/send-data`,
        `${venueId}/match-start`,
        `${venueId}/match-end`,
        `${venueId}/timer-updated`,
        `${venueId}/stop-clock`,
      ];
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
      const streamRes = await getMatchStreamsHook.getLiveStreamData({ matchId });
      const sponsorshipVideoRes = await getSponsorshipVideoHook.getSponsorshipVideo({ matchId });

      if (sponsorshipVideoRes) {
        setSponsorshipVideoUrl(sponsorshipVideoRes.videoUrl);
      }

      if (res && streamRes) {
        setStreamingData(null);

        console.log(res.tournament);

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
          venueNo: res.venue ? res.venue.no : null,
          clubName: res.club ? res.club.name : null,
          noOfFrames: res.noOfSets,
          actualStartTimeDate: res.actualStartTimeDate,
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
          tournamentPhaseId: res.tournamentSubItem?.tournamentItem?.tournamentPhase?.id ?? null,
          streams: streamRes.streams,
          eventFormat: res.tournament ? res.tournament.eventFormat : 'TEAMS',
          phase: res.phase ? res.phase : null,
          showFormatsAsGameNumber: res.tournament ? res.tournament.showFormatsAsGameNumber : null,
          showCummulativeScoreInCombination: res.tournament ? res.tournament.showCummulativeScoreInCombination : null,
          showLatestHandicapInCombination: res.tournament ? res.tournament.showLatestHandicapInCombination : null,
          isStopClockEnabled: res.isStopClockEnabled,
          stopClockFrameTimeInSeconds: res.stopClockFrameTimeInSeconds,
          stopClockTurnTimeInSeconds: res.stopClockTurnTimeInSeconds,
          stopClockVoiceEnabled: res.stopClockVoiceEnabled ?? false,
          stopClockState: res.stopClockState ?? null
        };

        lastStopClockTurnStartedAtRef.current = res.stopClockState?.turnStartedAt ?? null;

        setStreamingData(initialData);

        setViewershipData(initialData);

        if (res.matchStatus === 'LIVE' && !venueId) {
          const venueTopics = [
            `${res.venueId}/send-data`,
            `${res.venueId}/match-end`,
            `${res.venueId}/timer-updated`,
            `${res.venueId}/stop-clock`,
          ];
          connectToMqtt(venueTopics);
        }

        if (res.matchStatus === 'COMPLETED') {
          fetchLineupForCompletedMatch(initialData);
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load match data. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
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
            stopClockState: parsedMessage.stopClockState ?? prevData.stopClockState,
          };
        });
        if (parsedMessage.stopClockState?.turnStartedAt) {
          lastStopClockTurnStartedAtRef.current = parsedMessage.stopClockState.turnStartedAt;
        }
        break;
      case 'stop-clock': {
        const incomingTurnStartedAt = parsedMessage.turnStartedAt as string | null;
        const lastTurnStartedAt = lastStopClockTurnStartedAtRef.current;
        const isStale =
          !!incomingTurnStartedAt &&
          !!lastTurnStartedAt &&
          new Date(incomingTurnStartedAt).getTime() < new Date(lastTurnStartedAt).getTime();
        if (isStale) break;

        lastStopClockTurnStartedAtRef.current = incomingTurnStartedAt ?? lastTurnStartedAt;
        setStreamingData((prevData) => {
          if (prevData === null) return null;
          return {
            ...prevData,
            stopClockState: {
              activePlayerClock: parsedMessage.activePlayerClock,
              remainingFrameTimeInMs: parsedMessage.remainingFrameTimeInMs,
              currentTurnRemainingTimeInMs: parsedMessage.currentTurnRemainingTimeInMs,
              turnStartedAt: incomingTurnStartedAt,
            },
            stopClockVoiceEnabled: parsedMessage.stopClockVoiceEnabled ?? prevData.stopClockVoiceEnabled,
          };
        });
        break;
      }
      case 'match-start':
        clearLineup();
        fetchActiveMatchForVenue(venueId!);
        break;
      case 'timer-updated':
        setStreamingData((prevData) => {
          if (prevData === null) return null;
          return {
            ...prevData,
            expectedEndTimeDate: parsedMessage.expectedEndTimeDate,
          };
        });
        break;
      case 'match-end':
        if (currentStreamingData!.streams.find((stream) => stream.streamType === StreamType.CLOUD_PROVIDER)) {
          window.setTimeout(() => {
            setStreamingData(null);
            setViewershipData(null);

            if (scoreCheckIntervalRef.current !== null) {
              window.clearInterval(scoreCheckIntervalRef!.current);
              scoreCheckIntervalRef.current = null;
            }
          }, 20000);
        }
        fetchLineupForCompletedMatch(currentStreamingData);
        break;
    }
  };

  const fetchLineupForCompletedMatch = async (matchData: StreamingState | null) => {
    if (
      !matchData ||
      matchData.eventFormat !== 'TEAMS' ||
      !matchData.tournamentId ||
      !matchData.tournamentPhaseId ||
      !matchData.tournamentTeamOneId ||
      !matchData.tournamentTeamTwoId
    ) {
      return;
    }

    clearLineup();

    const lineup = await getLineupHook.getLineup({
      tournamentId: matchData.tournamentId,
      phaseId: matchData.tournamentPhaseId,
      teamOneId: matchData.tournamentTeamOneId,
      teamTwoId: matchData.tournamentTeamTwoId,
    });

    if (lineup) {
      setLineupData(lineup);
      setLineupClubInfo({ clubName: matchData.clubName, clubLogo: matchData.clubLogo });
      setShowLineup(true);
      lineupTimerRef.current = setTimeout(() => {
        setShowLineup(false);
      }, LINEUP_DISPLAY_MS);
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
        currentStreamingData && currentStreamingData?.teamOneHandicap && currentStreamingData.sport === 'SNOOKER'
          ? currentStreamingData?.teamOneHandicap
          : null,
        currentStreamingData && currentStreamingData?.teamTwoHandicap && currentStreamingData.sport === 'SNOOKER'
          ? currentStreamingData?.teamTwoHandicap
          : null,
      );

      consideredSets[consideredSets.length - 1] = {
        ...consideredSets[consideredSets.length - 1],
        teamOneScore: teamScoresForCurrentSet.side1,
        teamTwoScore: teamScoresForCurrentSet.side2,
      };

      const totalTeamScores = calculateTotalTeamScore(consideredSets);

      let handicapAdjustedScores = structuredClone(teamScoresForCurrentSet);

      if (currentStreamingData.sport === 'BILLIARDS') {
        if (currentStreamingData.teamOneHandicap) {
          const adjustedTeamOneScore = handicapAdjustedScores.side1 + currentStreamingData.teamOneHandicap;
          if (adjustedTeamOneScore >= 0) {
            handicapAdjustedScores.side1 = adjustedTeamOneScore;
          }
        }
        if (currentStreamingData.teamTwoHandicap) {
          const adjustedTeamTwoScore = handicapAdjustedScores.side2 + currentStreamingData.teamTwoHandicap;
          if (adjustedTeamTwoScore >= 0) {
            handicapAdjustedScores.side2 = adjustedTeamTwoScore;
          }
        }
      }

      setViewershipData({
        ...currentStreamingData,
        activePlayerId: activePlayerId,
        sets: consideredSets,
        isTeamOneHandicapApplied: handicapAdjustedScores.side1 !== teamScoresForCurrentSet.side1,
        isTeamTwoHandicapApplied: handicapAdjustedScores.side2 !== teamScoresForCurrentSet.side2,
        teamOneScore: totalTeamScores.side1,
        teamTwoScore: totalTeamScores.side2,
      });
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
    sponsorshipVideoUrl,
    lineupData,
    showLineup,
    lineupClubInfo,
  };
};

export default useStreaming;
