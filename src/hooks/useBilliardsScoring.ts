import { RootState, useAppDispatch } from '@/stores';
import {
  handleBackendUpdateOfData,
  handleBilliardsPointTrigger,
  handleBreakOff,
  handleEndFrame,
  handleEndGameThrunk,
  handleMatchStart,
  handlePlayerSelectState,
  handleReversePlayersState,
  handleSelectionOfBreakOffTeam,
  handleSettingsStateUpdateBilliards,
  handleTeamSwitch,
  handleUndoScoreClicked,
  matchSyncDataFromBackend,
} from '@/stores/thunks/sportThunks';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useOnlineStatus from './useOnlineStatus';
import useInterval from './useInterval';
import useBackButtonHandler from './useOnBackButtonClick';
import useStartMatch from '@/api/app/useStartMatch';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import React, { useEffect } from 'react';
import useTimer from './useTimer';
import { addMillisecondsToUTC } from '@/utils/functions';
import { toast } from '@/components/ui/use-toast';
import { getActiveSet, getActiveTeam, getActiveTurn } from '@/stores/selectors/commonSport';
import { BilliardPointType, Player } from '@/stores/types';
import { matchResetTimerRequest } from '@/api/scoring/scoringFunctions';
import { getActiveTurnPointTypes, getActiveTurnScore, getTeamSetScores } from '@/stores/selectors/billiardsSelector';
import { BilliardsPracticeSettingsData } from '@/components/forms/app/billiardsPracticeSettings';
import { BilliardsScoringButtonEnum } from '@/components/sections/scoring/billiardsScoringButton';
import { setExpectedEndTimeDate, setTeamPlayer } from '@/stores/slices/sportSlice';
import useCancelScoreboardEntry from '@/api/app/useCancelScoreboardEntry';
import mqtt from 'mqtt';

function playerSlot(playerNumber: number): { teamIndex: number; playerIndex: number } {
  return { teamIndex: playerNumber - 1, playerIndex: 0 };
}

const useBilliardsScoring = () => {
  // REDUX STATE
  const billiardsScoring = useSelector((state: RootState) => state.sport);
  const clubs = useSelector((state: RootState) => state.club);
  const activeTurnPointScore = useSelector(getActiveTurnScore);
  const activeTurnPointTypes = useSelector(getActiveTurnPointTypes);
  const { team1score, team2score } = useSelector(getTeamSetScores);

  // HANDLER TO UPDATE BACKEND WITH THE LATEST DATA ON STATE
  const handleUpdateToServer = async () => {
    if (isOnline && billiardsScoring.matchId !== null) {
      await dispatch(handleBackendUpdateOfData({}));
    }
  };

  // HANDLER ON MANUAL BACK BUTTOON CLICK
  const handleBackButtonClick = async () => {
    console.log('back button pressed');
  };

  // HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  useInterval(handleUpdateToServer, 3000);
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  useBackButtonHandler(handleBackButtonClick);

  // API
  const startMatchHook = useStartMatch();
  const getLiveMatchHook = useGetMatchLiveData();
  const { cancelScoreboardEntry } = useCancelScoreboardEntry();

  // LOCAL STATE
  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);
  const [openPlayerSelectCard, setOpenPlayerSelectCard] = React.useState(
    billiardsScoring.team1.players[0].id ? false : true,
  );
  const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);
  const [showLoadingModal, setShowLoadingModal] = React.useState(false);
  const [showBallColorModal, setShowBallColorModal] = React.useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showTimerModal, setShowTimeModal] = React.useState(false);

  // TIMER HOOKS
  // const { timeLeft, startTimer, setTimeLeft } = useTimer(billiardsScoring.timeInMinutes, () => {
  //   setShowTimeModal(true);
  // });
  const timeLeft = useTimer({
    endTime: billiardsScoring.expectedEndTimeDate ? new Date(billiardsScoring.expectedEndTimeDate) : null,
    startTime: null,
    onTimerComplete: () => {
      setShowTimeModal(true);
    },
  });

  useEffect(() => {
    const fetchMatchData = async () => {
      if (matchId) {
        setLoading(true);
        try {
          const res = await getLiveMatchHook.getLiveMatchData({ matchId });

          if (res !== null) {
            setOpenPlayerSelectCard(false);
            await dispatch(matchSyncDataFromBackend({ data: res }));
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

    fetchMatchData();
  }, [matchId, dispatch]);

  // SIDE EFFECTS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  // MQTT — auto-fill player slots from QR scans and advance drawer
  const onMqttPlayerRef = React.useRef<((data: any) => void) | null>(null);
  onMqttPlayerRef.current = (data) => {
    const { teamIndex, playerIndex } = playerSlot(data.playerNumber);
    const player: Player = {
      id: data.playerId,
      name: `${data.playerName}`.trim(),
      profilePhoto: data.profilePhoto ?? null,
    };
    dispatch(setTeamPlayer({ teamIndex, playerIndex, player }));

    // Billiards is always 2 players: player 1 → advance to slot 2; player 2 → close
    if (data.playerNumber === 1 && !billiardsScoring.team2.players[0]?.id) {
      setSelectedTeamIndex(1);
      setSelectedPlayerIndex(0);
    } else {
      setOpenPlayerSelectCard(false);
    }
  };

  useEffect(() => {
    if (!clubs.activeClub || billiardsScoring.matchId !== null) return;
    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const client = mqtt.connect(brokerUrl, { keepalive: 60, reconnectPeriod: 2000 });
    const topic = `${clubs.activeClub.venueId}/marker/add-player`;
    client.on('connect', () => client.subscribe(topic));
    client.on('message', (_t, msg) => {
      try {
        onMqttPlayerRef.current?.(JSON.parse(msg.toString()));
      } catch {}
    });
    client.on('error', () => client.end());
    return () => {
      client.end();
    };
  }, [clubs.activeClub?.venueId, billiardsScoring.matchId]);

  const handleBackClick = () => handleGoToHome();

  const handleSettingsClick = () => setOpenSettingsDrawer(true);

  const handleTeamClick = async (_teamIndex: number) => {
    const activeSet = getActiveSet(billiardsScoring.scoreHistory);

    if (activeSet) {
      await dispatch(handleTeamSwitch({ createUndoAndPushData: true }));
    }
    // Break-off team selection is handled only via the break-off dialog
  };

  // Called from break-off dialog to set the active team
  const handleBreakOffTeamSelect = async (teamIndex: number) => {
    await dispatch(handleSelectionOfBreakOffTeam({ teamIndex }));
  };

  const handleUndoButtonClick = async () => {
    await dispatch(handleUndoScoreClicked({}));
  };

  const handleScoringButtonClick = async (buttonType: BilliardsScoringButtonEnum) => {
    setShowLoadingModal(true);

    if (billiardsScoring.team1.players[0].id === null || billiardsScoring.team2.players[0].id === null) {
      toast({
        title: 'Error',
        description: 'Please Select Player First',
        variant: 'destructive',
      });
      setShowLoadingModal(false);
      return;
    }

    switch (buttonType) {
      case 'RED_IN_OFF':
      case 'RED_POT':
      case 'WHITE_IN_OFF':
      case 'WHITE_POT':
      case 'FOUL':
      case 'CANNON':
        await dispatch(handleBilliardsPointTrigger({ buttonType: buttonType as any as BilliardPointType }));
        setShowLoadingModal(false);
        break;
      case 'BREAK_OFF':
        if (billiardsScoring.scoreHistory.length === 0) {
          const activeTeamInfo = getActiveTeam(billiardsScoring.team1, billiardsScoring.team2);
          if (activeTeamInfo === null) {
            toast({
              title: 'Error',
              description: 'Please Select Team to Break',
              variant: 'destructive',
            });
            setShowLoadingModal(false);
            return;
          }
          setShowBallColorModal(true);
        } else {
          const activeTeamInfo = getActiveTeam(billiardsScoring.team1, billiardsScoring.team2);
          await dispatch(
            handleBreakOff({
              scoreOrder: [
                activeTeamInfo === 0 ? billiardsScoring.team1.players[0].id : billiardsScoring.team2.players[0].id,
                activeTeamInfo === 0 ? billiardsScoring.team2.players[0].id : billiardsScoring.team1.players[0].id,
              ],
            }),
          );
        }
        setShowLoadingModal(false);
        break;
    }
  };

  const handlePlayerSelect = async (playerIndex: number, teamIndex: number) => {
    if (!billiardsScoring.matchId && !billiardsScoring.tournamentId) {
      // Don't allow player selection during break-off waiting state
      const allSelected =
        billiardsScoring.team1.players[0].id !== null && billiardsScoring.team2.players[0].id !== null;
      if (allSelected) return;
      setSelectedTeamIndex(teamIndex);
      setSelectedPlayerIndex(playerIndex);
      setOpenPlayerSelectCard(true);
    }
  };

  const handlePlayerConfirm = async (player: Player) => {
    let showSettingsScreen: boolean = false;

    if (selectedPlayerIndex === 0 && selectedTeamIndex === 1 && billiardsScoring.team2.players[0].id === null) {
      showSettingsScreen = true;
    }

    await dispatch(
      await handlePlayerSelectState({
        player,
        playerIndex: selectedPlayerIndex,
        teamIndex: selectedTeamIndex,
      }),
    );
    if (selectedPlayerIndex === 0 && selectedTeamIndex === 0 && billiardsScoring.team2.players[0].id === null) {
      setSelectedTeamIndex(1);
    } else {
      setOpenPlayerSelectCard(false);
    }

    if (showSettingsScreen) {
      setOpenSettingsDrawer(true);
    }
  };

  const onBackInPlayerSelectModal = async () => {
    if (billiardsScoring.team1.players[0].id !== null) {
      // Clear player 1 so user must re-select
      dispatch(
        setTeamPlayer({
          teamIndex: 0,
          playerIndex: 0,
          player: { id: null, name: 'Player 1', profilePhoto: null },
        }),
      );
      setSelectedTeamIndex(0);
      setSelectedPlayerIndex(0);
      setOpenPlayerSelectCard(true);
    }
  };

  const onBackFromSettings = () => {
    // Clear player 2 so user must re-select
    dispatch(
      setTeamPlayer({
        teamIndex: 1,
        playerIndex: 0,
        player: { id: null, name: 'Player 1', profilePhoto: null },
      }),
    );
    setSelectedTeamIndex(1);
    setSelectedPlayerIndex(0);
    setOpenPlayerSelectCard(true);
  };

  const handleRemoveTeamPlayer = (globalIndex: number) => {
    const team1Count = billiardsScoring.team1.players.length;
    const teamIndex = globalIndex < team1Count ? 0 : 1;
    const playerIndex = globalIndex < team1Count ? globalIndex : globalIndex - team1Count;
    dispatch(
      setTeamPlayer({
        teamIndex,
        playerIndex,
        player: { id: null, name: `Player ${playerIndex + 1}`, profilePhoto: null },
      }),
    );
    setSelectedTeamIndex(teamIndex);
    setSelectedPlayerIndex(playerIndex);
  };

  const handleSettingsUpdate = async (values: BilliardsPracticeSettingsData) => {
    await dispatch(handleSettingsStateUpdateBilliards(values));
    setOpenSettingsDrawer(false);
  };

  const handleGoToHome = () => {
    if (clubs.activeClub) {
      cancelScoreboardEntry({ venueId: clubs.activeClub.venueId });
    }
    navigate('/app/home');
  };

  const handleEndFrameButton = async () => {
    setShowLoadingModal(true);

    const activeSet = getActiveSet(billiardsScoring.scoreHistory);
    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    setShowLoadingModal(false);
  };

  const handleEndGame = async () => {
    setShowLoadingModal(true);
    if (billiardsScoring.matchId === null) {
      await handleGoToHome();
      setShowLoadingModal(false);
      return;
    }

    try {
      await dispatch(handleEndGameThrunk({})).unwrap();

      await handleGoToHome();
    } catch (error) {
      console.error('Error ending game:', error);
      toast({
        title: 'Error',
        description: 'Failed to end game. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setShowLoadingModal(false);
    }
  };

  const handleTimerButtonAction = async (state: 'CONFIRM' | 'CANCEL') => {
    if (state === 'CONFIRM') {
      setShowLoadingModal(true);

      const newEndTimeDate = addMillisecondsToUTC(billiardsScoring.expectedEndTimeDate!, 30 * 60 * 1000);

      await matchResetTimerRequest({
        matchId: billiardsScoring.matchId!,
        expectedEndTimeDate: new Date(newEndTimeDate),
      });

      dispatch(setExpectedEndTimeDate({ expectedEndTimeDate: newEndTimeDate }));
      setShowLoadingModal(false);
    } else {
      await handleEndGame();
    }

    setShowTimeModal(false);
  };

  // const billiardsSportTypeToFormat = (
  //   data: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' | 'BILLIARDS_RACE_TO' | 'BILLIARDS_TIME_BASED',
  //   raceToValue: number | null,
  //   noOfSets: number | null,
  // ) => {
  //   switch (data) {
  //     case 'BILLIARDS_RACE_TO':
  //       return `${raceToValue ? raceToValue : '100'} UP`;
  //     case 'BILLIARDS_TIME_BASED':
  //       return `BEST OF ${noOfSets ? noOfSets : '1'}`;
  //     default:
  //       return `${raceToValue ? raceToValue : '100'} UP`;
  //   }
  // };

  const handleBilliardsSelectColorBall = async (type: 'white' | 'yellow') => {
    setShowBallColorModal(false);
    setShowLoadingModal(true);

    const playerOne = billiardsScoring.team1.players[0].id!;
    const playerTwo = billiardsScoring.team2.players[0].id!;

    const activeTeam = getActiveTeam(billiardsScoring.team1, billiardsScoring.team2);
    let isTeamReveresed = false;
    if ((activeTeam === 1 && type === 'yellow') || (activeTeam === 0 && type === 'white')) {
      await dispatch(handleReversePlayersState({ reverseOnApi: false }));
      isTeamReveresed = true;
    }

    const teamOneHandicap = isTeamReveresed ? billiardsScoring.teamTwoHandicap : billiardsScoring.teamOneHandicap;
    const teamTwoHandicap = isTeamReveresed ? billiardsScoring.teamOneHandicap : billiardsScoring.teamTwoHandicap;

    const tournamentTeamOneId = isTeamReveresed
      ? billiardsScoring.tournamentTeamTwoId
      : billiardsScoring.tournamentTeamOneId;
    const tournamentTeamTwoId = isTeamReveresed
      ? billiardsScoring.tournamentTeamOneId
      : billiardsScoring.tournamentTeamTwoId;

    const currentDate = new Date();
    const expectedEndTimeDate =
      billiardsScoring.timeInMinutes !== 0
        ? new Date(currentDate.getTime() + billiardsScoring.timeInMinutes * 60000)
        : undefined;
    const matchId = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId,
      expectedEndTimeDate: expectedEndTimeDate,
      sideOnePlayerOneId: isTeamReveresed
        ? billiardsScoring.team2.players[0].id!
        : billiardsScoring.team1.players[0].id!,
      sideTwoPlayerOneId: isTeamReveresed
        ? billiardsScoring.team1.players[0].id!
        : billiardsScoring.team2.players[0].id!,
      sport: 'BILLIARDS',
      sportType: billiardsScoring.format,
      streamingType: billiardsScoring.streaming,
      venueId: clubs.activeClub!.venueId,
      handicap: 0,
      maxScorePerSet: billiardsScoring.maxScorePerSet,
      noOfSets: billiardsScoring.noOfSets,
      cumulativeScoring: billiardsScoring.isCumulativeScoring,
      tournamentTeamOneId: tournamentTeamOneId ? tournamentTeamOneId : undefined,
      tournamentTeamTwoId: tournamentTeamTwoId ? tournamentTeamTwoId : undefined,
      tournamentId: billiardsScoring.tournamentId ? billiardsScoring.tournamentId : undefined,
      tournamentTeamOneScore: billiardsScoring.tournamentTeamOneScore
        ? billiardsScoring.tournamentTeamOneScore
        : undefined,
      tournamentTeamTwoScore: billiardsScoring.tournamentTeamTwoScore
        ? billiardsScoring.tournamentTeamTwoScore
        : undefined,
      teamOneHandicap: teamOneHandicap != null ? teamOneHandicap : undefined,
      teamTwoHandicap: teamTwoHandicap != null ? teamTwoHandicap : undefined,
      format: billiardsScoring.formatName ? billiardsScoring.formatName : `${billiardsScoring.timeInMinutes} Mins`,
      tournamentSubItemId: billiardsScoring.tournamentSubItemId ? billiardsScoring.tournamentSubItemId : undefined,
      switchType: billiardsScoring.switchType ? billiardsScoring.switchType : null,
      isRankingEvent: billiardsScoring.isRankingEvent,
      phase: billiardsScoring.phase,
    });

    if (matchId) {
      await dispatch(
        handleMatchStart({
          matchId,
          scoreOrder: isTeamReveresed ? [playerTwo, playerOne] : [playerOne, playerTwo],
          expectedEndTimeDate,
        }),
      );
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong while trying to start the match, please try again.',
        variant: 'destructive',
      });
    }

    setShowLoadingModal(false);
  };

  return {
    billiardsScoring,
    clubs,
    timeLeft,
    openSettingsDrawer,
    openPlayerSelectCard,
    handleBackClick,
    handleSettingsClick,
    handleScoringButtonClick,
    handlePlayerSelect,
    handlePlayerConfirm,
    handleSettingsUpdate,
    handleGoToHome,
    handleTeamClick,
    handleBreakOffTeamSelect,
    setOpenSettingsDrawer,
    setOpenPlayerSelectCard,
    selectedPlayerIndex,
    selectedTeamIndex,
    showLoadingModal,
    isOnline,
    getActiveTeam,
    showMenuDrawer,
    setShowMenuDrawer,
    getActiveSet,
    handleUndoButtonClick,
    handleEndGame,
    getActiveTurn,
    loading,
    activeTurnPointScore,
    activeTurnPointTypes,
    showBallColorModal,
    team1score,
    team2score,
    handleBilliardsSelectColorBall,
    handleEndFrameButton,
    onBackInPlayerSelectModal,
    onBackFromSettings,
    handleRemoveTeamPlayer,
    showTimerModal,
    handleTimerButtonAction,
  };
};

export default useBilliardsScoring;
