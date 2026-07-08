import { RootState } from '@/stores';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mqtt from 'mqtt';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import useMarkerClubs from '@/api/home/useMarkerClubs';
import useTimer from './useTimer';
import { toast } from '@/components/ui/use-toast';
import { Player, Set, StopClockState, TournamentItem, TournamentSubItem } from '@/stores/types';
import useBodyRotation from './useBodyRotation';
import { setActiveClub, setClubs } from '@/stores/slices/clubSlice';
import { withTurnStartShotTime } from '@/stores/selectors/commonSport';

export interface QrFlowPlayer {
  playerNumber: number;
  playerId: string;
  playerName: string;
  playerLastName: string;
  profilePhoto: string | null;
}

export interface QrFlowState {
  isActive: boolean;
  playerCount: 2 | 4;
  players: Record<number, QrFlowPlayer>;
}

export type { StopClockState };

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
  tournamentTeamOneId: string | null;
  tournamentTeamTwoId: string | null;
  teamOneHandicap: number | null;
  teamTwoHandicap: number | null;
  isTeamOneHandicapApplied?: boolean;
  isTeamTwoHandicapApplied?: boolean;
  maxScorePerSet: number | null;
  tournamentTeamOneName: string | null;
  tournamentTeamTwoName: string | null;
  tournamentName: string | null;
  actualStartTimeDate: string;
  clubLogo: string | null;
  format: string | null;
  venueNo: number | null;
  clubName: string | null;
  showFormatsAsGameNumber: boolean | null;
  showCummulativeScoreInCombination: boolean | null;
  showLatestHandicapInCombination: boolean | null;
  tournamentLogo: string | null;
  tournamentSubItem?: TournamentSubItem & {
    tournamentItem: TournamentItem;
  };
  eventFormat: 'SINGLES' | 'TEAMS';
  noOfFrames: number | null;
  isStopClockEnabled?: boolean;
  stopClockFrameTimeInSeconds?: number;
  stopClockTurnTimeInSeconds?: number;
  stopClockVoiceEnabled?: boolean;
  stopClockState?: StopClockState | null;
}

const useScoreboard = () => {
  const clubs = useSelector((state: RootState) => state.club);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getMarkerClubs } = useMarkerClubs('MARKER');
  const [qrFlowState, setQrFlowState] = React.useState<QrFlowState>({
    isActive: false,
    playerCount: 2,
    players: {},
  });
  const [searchParams] = useSearchParams();
  const searchParamsMatchId = searchParams.get('matchId');

  const getLiveMatchHook = useGetMatchLiveData();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [scoreBoardData, setScoreboardData] = React.useState<ScoreBoardState | null>(null);
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('landscape');
  const [showTimeOverAlert, setShowTimeOverAlert] = React.useState<boolean>(false);
  const { rotateBody } = useBodyRotation();
  const lastStopClockTurnStartedAtRef = React.useRef<string | null>(null);

  const timeLeft = useTimer({
    endTime: scoreBoardData && scoreBoardData.expectedEndTimeDate ? new Date(scoreBoardData.expectedEndTimeDate) : null,
    startTime: null,
    onTimerComplete: () => {
      setShowTimeOverAlert(true);
    },
  });

  useEffect(() => {
    fetchMatchData(searchParamsMatchId);
  }, [searchParamsMatchId]);

  // If the scoreboard is opened directly (without going through Home), fetch club data ourselves.
  useEffect(() => {
    if (clubs.activeClub !== null) return;
    setLoading(true);
    const bootstrap = async () => {
      const result = await getMarkerClubs();
      if (result && result.length > 0) {
        const formatted = result.map((v) => ({
          clubId: v.club.id,
          venueId: v.venue.id,
          clubName: v.club.name,
          clubLogo: v.club.imageUrl,
          venueNo: v.venue.no,
        }));
        dispatch(setClubs(formatted));
        dispatch(setActiveClub(formatted[0]));
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!clubs.activeClub) return;

    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const venueId = clubs.activeClub.venueId;
    const topics = [
      `${venueId}/send-data`,
      `${venueId}/match-start`,
      `${venueId}/match-end`,
      `${venueId}/timer-updated`,
      `${venueId}/stop-clock`,
      `${venueId}/scoreboard/initiate`,
      `${venueId}/scoreboard/add-player`,
      `${venueId}/scoreboard/cancel`,
    ];

    let active = true;

    // reconnectPeriod handles automatic retries — no manual reconnect loop needed
    const mqttClient = mqtt.connect(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 2000,
    });

    mqttClient.on('connect', () => {
      // Guard: cleanup may have fired before the connection resolved (React StrictMode)
      if (!active) {
        mqttClient.end(true);
        return;
      }
      topics.forEach((topic) => {
        mqttClient.subscribe(topic);
      });
    });

    mqttClient.on('message', (topic, message) => {
      if (active) handleNewMessage(topic, message.toString());
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    return () => {
      active = false;
      mqttClient.end(true); // force-close, suppresses reconnect
    };
  }, [clubs.activeClub]);

  const fetchMatchData = async (matchId: string | null) => {
    if (matchId) {
      setLoading(true);
      try {
        const res = await getLiveMatchHook.getLiveMatchData({ matchId });

        if (res !== null) {
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
            sets: withTurnStartShotTime(res.sets, res.stopClockState?.turnStartedAt ?? null),
            actualStartTime: res.actualStartTimeDate,
            expectedEndTimeDate: res.expectedEndTimeDate ? res.expectedEndTimeDate : null,
            teamOneLogo: res.tournamentTeamOne ? res.tournamentTeamOne.logo : null,
            teamTwoLogo: res.tournamentTeamTwo ? res.tournamentTeamTwo.logo : null,
            tournamentId: res.tournament ? res.tournament.id : null,
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
            venueNo: res.venue ? res.venue.no : null,
            tournamentSubItem: res.tournamentSubItem,
            clubName: res.club?.name ? res.club.name : null,
            tournamentTeamOneId: res.tournamentTeamOneId ? res.tournamentTeamOneId : null,
            tournamentTeamTwoId: res.tournamentTeamTwoId ? res.tournamentTeamTwoId : null,
            tournamentName: res.tournament ? res.tournament.name : null,
            eventFormat: res.tournament ? res.tournament.eventFormat : 'SINGLES',
            noOfFrames: res.noOfSets ? res.noOfSets : null,
            tournamentLogo: res.tournament?.logo ? res.tournament.logo : null,
            showFormatsAsGameNumber: res.tournament ? res.tournament.showFormatsAsGameNumber : null,
            showCummulativeScoreInCombination: res.tournament ? res.tournament.showCummulativeScoreInCombination : null,
            showLatestHandicapInCombination: res.tournament ? res.tournament.showLatestHandicapInCombination : null,
            isStopClockEnabled: res.isStopClockEnabled,
            stopClockFrameTimeInSeconds: res.stopClockFrameTimeInSeconds,
            stopClockTurnTimeInSeconds: res.stopClockTurnTimeInSeconds,
            stopClockVoiceEnabled: res.stopClockVoiceEnabled ?? false,
            stopClockState: res.stopClockState ?? null,
          });
          lastStopClockTurnStartedAtRef.current = res.stopClockState?.turnStartedAt ?? null;
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
    const venueId = clubs.activeClub?.venueId ?? '';
    const subtopic = topic.startsWith(`${venueId}/`) ? topic.slice(venueId.length + 1) : topic.split('/')[1];

    console.log(`THE TOPIC IS ${topic}`);

    switch (subtopic) {
      case 'send-data':
        setScoreboardData((prevData) => {
          if (prevData === null) return null;
          const updatedSets = parsedMessage.sets ? [...parsedMessage.sets] : prevData.sets;
          const stopClockState = parsedMessage.stopClockState ?? prevData.stopClockState;

          return {
            ...prevData,
            activePlayerId: parsedMessage.activePlayerId,
            teamOneScore: parsedMessage.teamOneScore,
            teamTwoScore: parsedMessage.teamTwoScore,
            sets: withTurnStartShotTime(updatedSets, stopClockState?.turnStartedAt ?? null),
            isTeamOneHandicapApplied: parsedMessage.isTeamOneHandicapApplied,
            isTeamTwoHandicapApplied: parsedMessage.isTeamTwoHandicapApplied,
            stopClockState,
          };
        });
        if (parsedMessage.stopClockState?.turnStartedAt) {
          lastStopClockTurnStartedAtRef.current = parsedMessage.stopClockState.turnStartedAt;
        }
        break;
      case 'match-start':
        const matchId = parsedMessage.matchId;
        setShowTimeOverAlert(false);
        await fetchMatchData(matchId);
        break;
      case 'match-end':
        setScoreboardData(null);
        setQrFlowState({ isActive: false, playerCount: 2, players: {} });
        navigate('/app/scoreboard');
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
      case 'stop-clock': {
        console.log('[useScoreboard] stop-clock message received:', parsedMessage);
        const incomingTurnStartedAt = parsedMessage.turnStartedAt as string | null;
        const lastTurnStartedAt = lastStopClockTurnStartedAtRef.current;
        const isStale =
          !!incomingTurnStartedAt &&
          !!lastTurnStartedAt &&
          new Date(incomingTurnStartedAt).getTime() < new Date(lastTurnStartedAt).getTime();
        if (isStale) break;

        lastStopClockTurnStartedAtRef.current = incomingTurnStartedAt ?? lastTurnStartedAt;
        setScoreboardData((prevData) => {
          if (prevData === null) return null;

          return {
            ...prevData,
            sets: withTurnStartShotTime(prevData.sets, incomingTurnStartedAt),
            stopClockState: {
              activePlayerClock: parsedMessage.activePlayerClock,
              remainingFrameTimeInMs: parsedMessage.remainingFrameTimeInMs,
              currentTurnRemainingTimeInMs: parsedMessage.currentTurnRemainingTimeInMs,
              turnStartedAt: incomingTurnStartedAt,
              frameStartedAt: parsedMessage.frameStartedAt ?? prevData.stopClockState?.frameStartedAt ?? null,
            },
            stopClockVoiceEnabled: parsedMessage.stopClockVoiceEnabled ?? prevData.stopClockVoiceEnabled,
          };
        });
        break;
      }
      case 'scoreboard/initiate':
        setQrFlowState({
          isActive: true,
          playerCount: parsedMessage.playerCount as 2 | 4,
          players: {},
        });
        break;
      case 'scoreboard/add-player':
        setQrFlowState((prev) => ({
          ...prev,
          players: {
            ...prev.players,
            [parsedMessage.playerNumber]: parsedMessage as QrFlowPlayer,
          },
        }));
        break;
      case 'scoreboard/cancel':
        setQrFlowState({ isActive: false, playerCount: 2, players: {} });
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
    activeClub: clubs.activeClub,
    qrFlowState,
  };
};

export default useScoreboard;
