import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  handleChangeScoreOnTrigger,
  handleEndFrame,
  handleFoulScore,
  handleMatchStart,
  handlePlayerSelectState,
  handleSelectionOfBreakOffTeam,
  handleSettingsStateUpdate,
  handleUndoScoreClicked,
} from '@/stores/thunks/snookerThunks';
import { getActiveTeam, getActiveSet } from '@/stores/selectors/commonSport';
import useTimer from '@/hooks/useTimer';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';
import useOnlineStatus from './useOnlineStatus';

const useSnookerScoring = () => {
  // REDUX STATE
  const snookerScoring = useSelector((state: RootState) => state.snooker);
  const clubs = useSelector((state: RootState) => state.club);
  const { team1score, team2score } = useSelector(getTeamSetScores);
  const activeTurnPointTypes = useSelector(getActiveTurnPointTypes);
  const activeTurnPointScore = useSelector(getActiveTurnScore);
  const posnScores = useSelector(calculateTeamPOSN);
  const { team1HighestTurnScores, team2HighestTurnScores } = useSelector(selectHighestTurnScores);
  const snookerButtonDisabledState = useSelector(snookerButtonsDisabledState);
  const numberOfRedsOnTable = useSelector(getNumberOfRedsLeft);

  // HANDLER WHEN BACK ONLINE
  const handleUpdateOnAppBackOnline = async () => {};

  // HOOKS
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus({
    onOnline: handleUpdateOnAppBackOnline,
  });

  // API
  const startMatchHook = useStartMatch();

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

  // TIMER HOOKS
  const { timeLeft, startTimer } = useTimer(snookerScoring.timeInMinutes, () => {
    // Logic to handle when timer completes
  });

  // SIDE EFFECTS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  // HANDLERS
  const handleBackClick = () => setGoBackGameModal(true);

  const handleSettingsClick = () => setOpenSettingsDrawer(true);

  const handleStartTimer = () => startTimer();

  const handleTeamClick = async (teamIndex: number) => {
    const activeSet = getActiveSet(snookerScoring.scoreHistory);

    if (activeSet) {
      return;
    } else {
      await dispatch(handleSelectionOfBreakOffTeam({ teamIndex }));
    }
  };

  const handleMatchCreation = async (playerOrder: string[]) => {
    const currentDate = new Date();
    const matchId = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId,
      expectedEndTimeDate: new Date(currentDate.getTime() + snookerScoring.timeInMinutes * 60000),
      sideOnePlayerOneId: snookerScoring.team1.players[0].id!,
      sideTwoPlayerOneId: snookerScoring.team2.players[0].id!,
      sideOnePlayerTwoId: snookerScoring.team1.players.length > 1 ? snookerScoring.team1.players[1].id! : undefined,
      sideTwoPlayerTwoId: snookerScoring.team2.players.length > 1 ? snookerScoring.team1.players[1].id! : undefined,
      sport: 'SNOOKER',
      sportType: snookerScoring.format,
      streamingType: snookerScoring.streaming,
      venueId: clubs.activeClub!.venueId,
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
      case 'START_FRAME':
        break;
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
      case 'UNDO_SCORE':
        await dispatch(handleUndoScoreClicked({}));
        setShowLoadingModal(false);
        break;
      case 'FOUL':
        setOpenFoulDrawer(true);
        break;
      case 'END_FRAME':
        await dispatch(handleEndFrame({}));
        break;
      case 'END_GAME':
        setShowEndGameModal(true);
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

  const handleFoulUpdate = async (values: any) => {
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
  };
};

export default useSnookerScoring;
