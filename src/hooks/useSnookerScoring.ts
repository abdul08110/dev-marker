import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/stores';
import { toast } from '@/components/ui/use-toast';
import useStartMatch from '@/api/app/useStartMatch';
import { Player, SnookerPointType } from '@/stores/types';
import {
  calculateTeamPOSN,
  getActiveTurnPointTypes,
  getActiveTurnScore,
  getNumberOfRedsLeft,
  getTeamSetScores,
  selectHighestTurnScores,
  snookerButtonsDisabledState,
} from '@/stores/selectors/snookerSelector';
import {
  handleBackendUpdateOfData,
  handleBreakOff,
  handleChangeScoreOnTrigger,
  handleConcedeFrame,
  handleCorrectionState,
  handleEndFrame,
  handleFoulScore,
  handleMatchStart,
  handlePlayerSelectState,
  handleRerackState,
  handleReversePlayersState,
  handleSelectionOfBreakOffTeam,
  handleSettingsStateUpdate,
  handleUndoScoreClicked,
  matchSyncDataFromBackend,
} from '@/stores/thunks/sportThunks';
import { getActiveTeam, getActiveSet } from '@/stores/selectors/commonSport';
import useTimer from '@/hooks/useTimer';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';
import useOnlineStatus from './useOnlineStatus';
import { SnookerFoulData } from '@/components/forms/app/snookerFoul';
import { SnookerScoreCorrectionData } from '@/components/forms/app/snookerScoreCorrection';
import { SnookerConcedeFrameData } from '@/components/forms/app/snookerConcedeFrame';
import useInterval from './useInterval';
import { matchEndGameRequest } from '@/api/scoring/scoringFunctions';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import { getTimeLeftInMinutes } from '@/utils/functions';
import useBackButtonHandler from './useOnBackButtonClick';

const useSnookerScoring = () => {
  // REDUX STATE
  const snookerScoring = useSelector((state: RootState) => state.sport);
  const clubs = useSelector((state: RootState) => state.club);
  const { team1score, team2score } = useSelector(getTeamSetScores);
  const activeTurnPointTypes = useSelector(getActiveTurnPointTypes);
  const activeTurnPointScore = useSelector(getActiveTurnScore);
  const posnScores = useSelector(calculateTeamPOSN);
  const { team1HighestTurnScores, team2HighestTurnScores } = useSelector(selectHighestTurnScores);
  const snookerButtonDisabledState = useSelector(snookerButtonsDisabledState);
  const numberOfRedsOnTable = useSelector(getNumberOfRedsLeft);

  // HANDLER TO UPDATE BACKEND WITH THE LATEST DATA ON STATE
  const handleUpdateToServer = async () => {
    if (isOnline && snookerScoring.matchId !== null) {
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

  // LOCAL STATE
  const [openFoulDrawer, setOpenFoulDrawer] = React.useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);
  const [openPlayerSelectCard, setOpenPlayerSelectCard] = React.useState(true);
  const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);
  const [showEndGameModal, setShowEndGameModal] = React.useState(false);
  const [goBackGameModal, setGoBackGameModal] = React.useState(false);
  const [isLongActive, setIsLongActive] = React.useState(false);
  const [showLoadingModal, setShowLoadingModal] = React.useState(false);
  const [showPlayerOrderModal, setShowPlayerOrderModal] = React.useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = React.useState(false);
  const [showCorrectionDrawer, setShowCorrectionDrawer] = React.useState(false);
  const [showConcedeFrameDrawer, setShowConcedeFrameDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // TIMER HOOKS
  const { timeLeft, startTimer, setTimeLeft } = useTimer(snookerScoring.timeInMinutes, () => {
    // Logic to handle when timer completes
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

    fetchMatchData();
  }, [matchId, dispatch]);

  // SIDE EFFECTS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  // HANDLERS
  const handleBackClick = () => handleGoToHome();

  const handleSettingsClick = () => setOpenSettingsDrawer(true);

  const handleTeamClick = async (teamIndex: number) => {
    const activeSet = getActiveSet(snookerScoring.scoreHistory);

    if (activeSet) {
      return;
    } else {
      await dispatch(handleSelectionOfBreakOffTeam({ teamIndex }));
    }
  };

  const handleMatchCreation = async (playerOrder: string[]) => {
    let isTeamReveresed = false;
    const activeTeam = getActiveTeam(snookerScoring.team1, snookerScoring.team2);

    if (activeTeam === 1) {
      await dispatch(handleReversePlayersState({}));
      isTeamReveresed = true;
    }

    const currentDate = new Date();
    const matchId = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId,
      expectedEndTimeDate: new Date(currentDate.getTime() + snookerScoring.timeInMinutes * 60000),
      sideOnePlayerOneId: isTeamReveresed ? snookerScoring.team2.players[0].id! : snookerScoring.team1.players[0].id!,
      sideTwoPlayerOneId: isTeamReveresed ? snookerScoring.team1.players[0].id! : snookerScoring.team2.players[0].id!,
      sideOnePlayerTwoId:
        snookerScoring.team1.players.length > 1
          ? isTeamReveresed
            ? snookerScoring.team2.players[1].id!
            : snookerScoring.team1.players[1].id!
          : undefined,
      sideTwoPlayerTwoId:
        snookerScoring.team2.players.length > 1
          ? isTeamReveresed
            ? snookerScoring.team1.players[1].id!
            : snookerScoring.team2.players[1].id!
          : undefined,
      sport: 'SNOOKER',
      sportType: snookerScoring.format,
      streamingType: snookerScoring.streaming,
      venueId: clubs.activeClub!.venueId,
      handicap: isTeamReveresed ? -snookerScoring.handicap : snookerScoring.handicap,
      maxScorePerSet: snookerScoring.maxScorePerSet,
      noOfSets: snookerScoring.noOfSets,
    });

    if (matchId) {
      await dispatch(
        handleMatchStart({
          matchId,
          scoreOrder: playerOrder,
        }),
      );
      await startTimer();
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong while trying to start the match, please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUndoButtonClick = async () => {
    await dispatch(handleUndoScoreClicked({}));
  };

  const handleScoringButtonClick = async (buttonType: SnookerScoringButtonEnum) => {
    setShowLoadingModal(true);
    if (snookerScoring.team1.players[0].id === null || snookerScoring.team2.players[0].id === null) {
      toast({
        title: 'Error',
        description: 'Please Select Player First',
        variant: 'destructive',
      });
      setShowLoadingModal(false);
      return;
    }
    switch (buttonType) {
      case 'RED':
      case 'YELLOW':
      case 'GREEN':
      case 'BROWN':
      case 'BLUE':
      case 'PINK':
      case 'PLAY_SAFE':
      case 'MISSED_POT':
      case 'BLACK':
        await dispatch(
          handleChangeScoreOnTrigger({ pointType: buttonType as any as SnookerPointType, isLongShot: isLongActive }),
        );
        setIsLongActive(false);
        setShowLoadingModal(false);
        break;
      case 'FOUL':
        setOpenFoulDrawer(true);
        setShowLoadingModal(false);
        break;
      case 'BREAK_OFF':
        if (snookerScoring.scoreHistory.length === 0) {
          const activeTeamInfo = getActiveTeam(snookerScoring.team1, snookerScoring.team2);
          if (activeTeamInfo === null) {
            toast({
              title: 'Error',
              description: 'Please Select Team to Break',
              variant: 'destructive',
            });
            setShowLoadingModal(false);
            return;
          }
          if (snookerScoring.team1.players.length === 1 && snookerScoring.team2.players.length === 1) {
            await handleMatchCreation([
              activeTeamInfo === 0 ? snookerScoring.team1.players[0].id : snookerScoring.team2.players[0].id,
              activeTeamInfo === 0 ? snookerScoring.team2.players[0].id : snookerScoring.team1.players[0].id,
            ]);
            setShowLoadingModal(false);
            return;
          } else {
            setShowPlayerOrderModal(true);
            setShowLoadingModal(false);
            return;
          }
        } else {
          const activeTeamInfo = getActiveTeam(snookerScoring.team1, snookerScoring.team2);
          if (snookerScoring.team1.players.length === 1 && snookerScoring.team2.players.length === 1) {
            await dispatch(
              handleBreakOff({
                scoreOrder: [
                  activeTeamInfo === 0 ? snookerScoring.team1.players[0].id : snookerScoring.team2.players[0].id,
                  activeTeamInfo === 0 ? snookerScoring.team2.players[0].id : snookerScoring.team1.players[0].id,
                ],
              }),
            );
          } else {
            setShowPlayerOrderModal(true);
          }
          setShowLoadingModal(false);
          return;
        }
        setShowLoadingModal(false);
        break;
      default:
        return;
    }
  };

  const handlePlayerOrderSelect = async (values: { breakPlayerId: string; followThroughPlayerId: string }) => {
    setShowPlayerOrderModal(false);
    setShowLoadingModal(true);

    const teamOnePlayers = snookerScoring.team1.players;
    const teamTwoPlayers = snookerScoring.team2.players;
    const activeTeam = await getActiveTeam(snookerScoring.team1, snookerScoring.team2);
    const playerOrder = [
      values.breakPlayerId,
      values.followThroughPlayerId,
      activeTeam === 0
        ? teamOnePlayers.find((value) => value.id !== values.breakPlayerId)!.id!
        : teamTwoPlayers.find((value) => value.id !== values.breakPlayerId)!.id!,
      activeTeam === 0
        ? teamTwoPlayers.find((value) => value.id !== values.followThroughPlayerId)!.id!
        : teamOnePlayers.find((value) => value.id !== values.followThroughPlayerId)!.id!,
    ];

    if (snookerScoring.scoreHistory.length === 0) {
      await handleMatchCreation(playerOrder);
    } else {
      await dispatch(handleBreakOff({ scoreOrder: playerOrder }));
    }

    setShowLoadingModal(false);
  };

  const handlePlayerSelect = async (playerIndex: number, teamIndex: number) => {
    if (!snookerScoring.matchId) {
      setSelectedTeamIndex(teamIndex);
      setSelectedPlayerIndex(playerIndex);
      setOpenPlayerSelectCard(true);
    }
  };

  const handlePlayerConfirm = async (player: Player) => {
    await dispatch(
      await handlePlayerSelectState({
        player,
        playerIndex: selectedPlayerIndex,
        teamIndex: selectedTeamIndex,
      }),
    );
    if (selectedPlayerIndex === 0 && selectedTeamIndex === 0 && snookerScoring.team2.players[0].id === null) {
      setSelectedTeamIndex(1);
    } else {
      setOpenPlayerSelectCard(false);
    }
  };

  const handleFoulUpdate = async (values: SnookerFoulData) => {
    await dispatch(handleFoulScore(values));
    setOpenFoulDrawer(false);
  };

  const handleSettingsUpdate = async (values: any) => {
    await dispatch(handleSettingsStateUpdate(values));
    setOpenSettingsDrawer(false);
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleEndFrameButton = async () => {
    setShowLoadingModal(true);

    const activeSet = getActiveSet(snookerScoring.scoreHistory);
    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    setShowLoadingModal(false);
  };

  const handleEndGame = async () => {
    setShowLoadingModal(true);
    const activeSet = getActiveSet(snookerScoring.scoreHistory);
    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    const res = await matchEndGameRequest({ id: snookerScoring.matchId! });
    if (res === true) {
      await handleGoToHome();
    }

    setShowLoadingModal(false);
  };

  const handleConcedeFrameSelection = async (values: SnookerConcedeFrameData) => {
    setShowLoadingModal(true);
    setShowConcedeFrameDrawer(false);
    setShowMenuDrawer(false);

    await dispatch(handleConcedeFrame({ values }));
    setShowLoadingModal(false);
  };

  const handleRerack = async () => {
    setShowLoadingModal(true);
    setShowMenuDrawer(false);

    await dispatch(handleRerackState({}));

    setShowLoadingModal(false);
  };

  const handleCorrection = async (values: SnookerScoreCorrectionData) => {
    setShowLoadingModal(true);
    setShowCorrectionDrawer(false);
    setShowMenuDrawer(false);

    await dispatch(handleCorrectionState({ values }));

    setShowLoadingModal(false);
  };

  return {
    snookerScoring,
    clubs,
    timeLeft,
    showEndGameModal,
    setShowEndGameModal,
    goBackGameModal,
    setGoBackGameModal,
    openFoulDrawer,
    openSettingsDrawer,
    openPlayerSelectCard,
    handleBackClick,
    handleSettingsClick,
    handleScoringButtonClick,
    handlePlayerSelect,
    handlePlayerConfirm,
    handleFoulUpdate,
    handleSettingsUpdate,
    handleGoToHome,
    team1score,
    team2score,
    activeTurnPointTypes,
    activeTurnPointScore,
    posnScores,
    team1HighestTurnScores,
    team2HighestTurnScores,
    snookerButtonDisabledState,
    numberOfRedsOnTable,
    handleTeamClick,
    setOpenFoulDrawer,
    setOpenSettingsDrawer,
    setOpenPlayerSelectCard,
    selectedPlayerIndex,
    selectedTeamIndex,
    isLongActive,
    setIsLongActive,
    showLoadingModal,
    isOnline,
    showPlayerOrderModal,
    handlePlayerOrderSelect,
    setShowPlayerOrderModal,
    getActiveTeam,
    showMenuDrawer,
    setShowMenuDrawer,
    getActiveSet,
    handleUndoButtonClick,
    handleEndGame,
    handleConcedeFrameSelection,
    handleRerack,
    handleCorrection,
    showCorrectionDrawer,
    setShowCorrectionDrawer,
    showConcedeFrameDrawer,
    setShowConcedeFrameDrawer,
    loading,
    handleEndFrameButton,
  };
};

export default useSnookerScoring;
