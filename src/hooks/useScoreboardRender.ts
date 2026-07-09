import React, { useEffect } from 'react';
import mqtt from 'mqtt';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import useTimer from './useTimer';
import { toast } from '@/components/ui/use-toast';
import { ClubData, Player, Set, StopClockState, TournamentItem, TournamentSubItem } from '@/stores/types';
import useBodyRotation from './useBodyRotation';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import { QrFlowPlayer, QrFlowState } from './useScoreboard';
import { withStopClockAnchors } from '@/stores/selectors/commonSport';

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
  actualStartTimeDate: string;
  clubLogo: string | null;
  format: string | null;
  venueNo: number | null;
  tournamentName: string | null;
  clubName: string | null;
  tournamentSubItem?: TournamentSubItem & {
    tournamentItem: TournamentItem;
  };
  eventFormat: 'SINGLES' | 'TEAMS';
  noOfFrames: number | null;
  showFormatsAsGameNumber: boolean | null;
  showCummulativeScoreInCombination: boolean | null;
  showLatestHandicapInCombination: boolean | null;
  tournamentLogo: string | null;
  isStopClockEnabled?: boolean;
  stopClockFrameTimeInSeconds?: number;
  stopClockTurnTimeInSeconds?: number;
  stopClockVoiceEnabled?: boolean;
  stopClockState?: StopClockState | null;
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
  const [clubInfo, setClubInfo] = React.useState<{
    clubName: string | null;
    clubPhoto: string | null;
    venueNo: number | null;
  }>({ clubName: null, clubPhoto: null, venueNo: null });
  const [qrFlowState, setQrFlowState] = React.useState<QrFlowState>({
    isActive: false,
    playerCount: 2,
    players: {},
  });
  const { rotateBody } = useBodyRotation();
  const lastStopClockTurnStartedAtRef = React.useRef<string | null>(null);

  const activeClub: ClubData | null = searchParamsVenueId
    ? {
        clubId: '',
        venueId: searchParamsVenueId,
        clubName: clubInfo.clubName,
        clubLogo: clubInfo.clubPhoto,
        venueNo: clubInfo.venueNo,
      }
    : null;

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
      `${searchParamsVenueId}/stop-clock`,
      `${searchParamsVenueId}/scoreboard/initiate`,
      `${searchParamsVenueId}/scoreboard/add-player`,
      `${searchParamsVenueId}/scoreboard/cancel`,
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
        setClubInfo({
          clubName: liveMatchByVenueResponse.clubName,
          clubPhoto: liveMatchByVenueResponse.clubPhoto,
          venueNo: liveMatchByVenueResponse.venueNo,
        });
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
            sets: withStopClockAnchors(res.sets, res.stopClockState),
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
            showFormatsAsGameNumber: res.tournament ? res.tournament.showFormatsAsGameNumber : null,
            showCummulativeScoreInCombination: res.tournament ? res.tournament.showCummulativeScoreInCombination : null,
            showLatestHandicapInCombination: res.tournament ? res.tournament.showLatestHandicapInCombination : null,
            tournamentLogo: res.tournament?.logo ? res.tournament.logo : null,
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
    }

    setLoading(false);
  };

  const handleNewMessage = async (topic: string, message: string) => {
    const parsedMessage = JSON.parse(message);
    const topicWithoutId =
      searchParamsVenueId && topic.startsWith(`${searchParamsVenueId}/`)
        ? topic.slice(searchParamsVenueId.length + 1)
        : topic.split('/')[1];

    console.log(`THE TOPIC IS ${topic}`);

    switch (topicWithoutId) {
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
            sets: withStopClockAnchors(updatedSets, stopClockState),
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
        await checkIfLiveMatchAndfetchMatchData(null, matchId);
        break;
      case 'match-end':
        setScoreboardData(null);
        setQrFlowState({ isActive: false, playerCount: 2, players: {} });
        setShowTimeOverAlert(false);
        break;
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

          const newStopClockState = {
            activePlayerClock: parsedMessage.activePlayerClock,
            remainingFrameTimeInMs: parsedMessage.remainingFrameTimeInMs,
            currentTurnRemainingTimeInMs: parsedMessage.currentTurnRemainingTimeInMs,
            turnStartedAt: incomingTurnStartedAt,
            frameStartedAt: parsedMessage.frameStartedAt ?? prevData.stopClockState?.frameStartedAt ?? null,
          };

          return {
            ...prevData,
            sets: withStopClockAnchors(prevData.sets, newStopClockState),
            stopClockState: newStopClockState,
            stopClockVoiceEnabled: parsedMessage.stopClockVoiceEnabled ?? prevData.stopClockVoiceEnabled,
          };
        });
        break;
      }
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
    clubInfo,
    qrFlowState,
    activeClub,
  };
};

export default useScoreboardRender;
