import { RootState, useAppDispatch } from '@/stores';
import {
  handleBackendUpdateOfData,
  handleBilliardsPointTrigger,
  handleEndFrame,
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
import { getTimeLeftInMinutes } from '@/utils/functions';
import { toast } from '@/components/ui/use-toast';
import { getActiveSet, getActiveTeam, getActiveTurn } from '@/stores/selectors/commonSport';
import { BilliardPointType, Player } from '@/stores/types';
import { matchEndGameRequest } from '@/api/scoring/scoringFunctions';
import { getActiveTurnPointTypes, getActiveTurnScore, getTeamSetScores } from '@/stores/selectors/billiardsSelector';
import { BilliardsPracticeSettingsData } from '@/components/forms/app/billiardsPracticeSettings';
import { BilliardsScoringButtonEnum } from '@/components/sections/scoring/billiardsScoringButton';

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

  // LOCAL STATE
  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);
  const [openPlayerSelectCard, setOpenPlayerSelectCard] = React.useState(true);
  const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);
  const [showLoadingModal, setShowLoadingModal] = React.useState(false);
  const [showBallColorModal, setShowBallColorModal] = React.useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // TIMER HOOKS
  const { timeLeft, startTimer, setTimeLeft } = useTimer(billiardsScoring.timeInMinutes, () => {
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
            setTimeLeft(res.expectedEndTimeDate ? Math.round(getTimeLeftInMinutes(res.expectedEndTimeDate) * 60) : 0);
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

  const handleBackClick = () => handleGoToHome();

  const handleSettingsClick = () => setOpenSettingsDrawer(true);

  const handleTeamClick = async (teamIndex: number) => {
    const activeSet = getActiveSet(billiardsScoring.scoreHistory);

    if (activeSet) {
      await dispatch(handleTeamSwitch({ createUndoAndPushData: true }));
    } else {
      await dispatch(handleSelectionOfBreakOffTeam({ teamIndex }));
    }
  };

  const handleMatchCreation = async (playerOrder: string[]) => {
    const currentDate = new Date();
    const matchId = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId,
      expectedEndTimeDate: new Date(currentDate.getTime() + billiardsScoring.timeInMinutes * 60000),
      sideOnePlayerOneId: playerOrder[0],
      sideTwoPlayerOneId: playerOrder[1],
      sport: 'BILLIARDS',
      sportType: billiardsScoring.format,
      streamingType: billiardsScoring.streaming,
      venueId: clubs.activeClub!.venueId,
      handicap: billiardsScoring.handicap,
      maxScorePerSet: billiardsScoring.maxScorePerSet,
      noOfSets: billiardsScoring.noOfSets,
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
        }
        setShowLoadingModal(false);
        break;
    }
  };

  const handlePlayerSelect = async (playerIndex: number, teamIndex: number) => {
    if (!billiardsScoring.matchId) {
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
    if (selectedPlayerIndex === 0 && selectedTeamIndex === 0 && billiardsScoring.team2.players[0].id === null) {
      setSelectedTeamIndex(1);
    } else {
      setOpenPlayerSelectCard(false);
    }
  };

  const handleSettingsUpdate = async (values: BilliardsPracticeSettingsData) => {
    await dispatch(handleSettingsStateUpdateBilliards(values));
    setOpenSettingsDrawer(false);
  };

  const handleGoToHome = () => {
    navigate('/');
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
    const activeSet = getActiveSet(billiardsScoring.scoreHistory);
    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    const res = await matchEndGameRequest({ id: billiardsScoring.matchId! });
    if (res === true) {
      await handleGoToHome();
    }

    setShowLoadingModal(false);
  };

  const handleBilliardsSelectColorBall = async (type: 'white' | 'yellow') => {
    setShowBallColorModal(false);
    setShowLoadingModal(true);

    const playerOne = billiardsScoring.team1.players[0].id!;
    const playerTwo = billiardsScoring.team2.players[0].id!;

    let unModifiedScoreOrder = [playerOne, playerTwo];

    const activeTeam = getActiveTeam(billiardsScoring.team1, billiardsScoring.team2);
    let isTeamReveresed = false;
    if ((activeTeam === 1 && type === 'yellow') || (activeTeam === 0 && type === 'white')) {
      await dispatch(handleReversePlayersState({}));
      isTeamReveresed = true;
    }
    await handleMatchCreation(isTeamReveresed === true ? [playerTwo, playerOne] : unModifiedScoreOrder);

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
  };
};

export default useBilliardsScoring;
