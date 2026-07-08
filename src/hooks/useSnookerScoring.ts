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
  getTurnPointTypes,
  selectHighestTurnScores,
  snookerButtonsDisabledState,
} from '@/stores/selectors/snookerSelector';
import {
  changeBackendUpdatedState,
  handleBackendUpdateOfData,
  handleBreakOff,
  handleChangeScoreOnTrigger,
  handleConcedeFrame,
  handleCorrectionState,
  handleEndFrame,
  handleEndGameThrunk,
  handleFoulScore,
  handleMatchStart,
  handlePlayerSelectState,
  handleRerackState,
  handleReversePlayersState,
  handleSelectionOfBreakOffTeam,
  handleSettingsStateUpdate,
  handleStartTournamentMatch,
  handleUndoScoreClicked,
  matchSyncDataFromBackend,
} from '@/stores/thunks/sportThunks';
import { getActiveTeam, getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import useTimer from '@/hooks/useTimer';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';
import useOnlineStatus from './useOnlineStatus';
import { SnookerFoulData } from '@/components/forms/app/snookerFoul';
import { SnookerScoreCorrectionData } from '@/components/forms/app/snookerScoreCorrection';
import { SnookerConcedeFrameData } from '@/components/forms/app/snookerConcedeFrame';
import useInterval from './useInterval';
import { matchResetTimerRequest } from '@/api/scoring/scoringFunctions';
import useGetMatchLiveData from '@/api/app/useGetMatchData';
import { addMillisecondsToUTC } from '@/utils/functions';
import useBackButtonHandler from './useOnBackButtonClick';
import { NoOfPlayersDefault, SnookerPracticeSettingsData } from '@/components/forms/app/snookerPracticeSettings';
import {
  addPlayer,
  setExpectedEndTimeDate,
  setStopClockState,
  setTeamPlayer,
  toggleTurnClock,
} from '@/stores/slices/sportSlice';
import useCancelScoreboardEntry from '@/api/app/useCancelScoreboardEntry';
import { useStopClockTick } from './useStopClockTick';
import mqtt from 'mqtt';

function playerSlot(playerNumber: number, playerCount: number): { teamIndex: number; playerIndex: number } {
  if (playerCount === 2) return { teamIndex: playerNumber - 1, playerIndex: 0 };
  if (playerNumber <= 2) return { teamIndex: 0, playerIndex: playerNumber - 1 };
  return { teamIndex: 1, playerIndex: playerNumber - 3 };
}

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
  const teamActiveSetPoints = useSelector(getTurnPointTypes);

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
  // Never trust a client-side guess about the stop clock's state after a dropped request —
  // pull the authoritative activePlayerClock/turnStartedAt/frameStartedAt from the server instead.
  const resyncStopClockState = async () => {
    if (!snookerScoring.matchId) return;
    const res = await getLiveMatchHook.getLiveMatchData({ matchId: snookerScoring.matchId });
    if (res?.stopClockState) {
      dispatch(setStopClockState({ stopClockState: res.stopClockState }));
    }
  };
  const isOnline = useOnlineStatus({ onOnline: resyncStopClockState });
  useInterval(handleUpdateToServer, 1000);
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  const playerCountParam = searchParams.get('playerCount');
  const defaultNoOfPlayers: NoOfPlayersDefault = playerCountParam === '4' ? '4' : '2';
  useBackButtonHandler(handleBackButtonClick);

  // API
  const startMatchHook = useStartMatch();
  const getLiveMatchHook = useGetMatchLiveData();
  const { cancelScoreboardEntry } = useCancelScoreboardEntry();

  // LOCAL STATE
  const [openFoulDrawer, setOpenFoulDrawer] = React.useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);
  const [openPlayerSelectCard, setOpenPlayerSelectCard] = React.useState(
    snookerScoring.team1.players[0].id ? false : true,
  );
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
  const [showTimerModal, setShowTimeModal] = React.useState(false);

  // The shot clock's toggle is local (no backend round trip). stopClockState.turnStartedAt is
  // only the transport value; the display reads off the active turn's mirrored startShotTime so
  // it's correctly scoped to whichever turn is currently active.
  const activeTurn = getActiveTurn(getActiveSet(snookerScoring.scoreHistory));
  const isStopClockRunning = !!activeTurn?.startShotTime;

  // STOP CLOCK LIVE DISPLAY (ticks locally off frameStartedAt/startShotTime, no per-second MQTT/API calls)
  const stopClockTick = useStopClockTick(
    snookerScoring.stopClockState?.frameStartedAt,
    snookerScoring.stopClockFrameTimeInSeconds,
    activeTurn?.startShotTime,
    snookerScoring.stopClockTurnTimeInSeconds,
  );

  // TIMER HOOKS
  // const { timeLeft, startTimer, setTimeLeft } = useTimer(snookerScoring.timeInMinutes, () => {
  //   setShowTimeModal(true);
  // });

  const timeLeft = useTimer({
    endTime: snookerScoring.expectedEndTimeDate ? new Date(snookerScoring.expectedEndTimeDate) : null,
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

  // Pre-build second player slots when 4-player mode is chosen upfront (manual flow).
  // Skip if slots already have IDs — that means they came from the MQTT scoreboard flow.
  useEffect(() => {
    if (defaultNoOfPlayers === '4') {
      if (!snookerScoring.team1.players[1]?.id) {
        dispatch(addPlayer({ teamIndex: 0 }));
      }
      if (!snookerScoring.team2.players[1]?.id) {
        dispatch(addPlayer({ teamIndex: 1 }));
      }
    }
  }, []);

  // SIDE EFFECTS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  // MQTT — auto-fill player slots from QR scans and advance drawer
  const onMqttPlayerRef = React.useRef<((data: any) => void) | null>(null);
  onMqttPlayerRef.current = (data) => {
    const count = defaultNoOfPlayers === '4' ? 4 : 2;
    const { teamIndex, playerIndex } = playerSlot(data.playerNumber, count);
    const player: Player = {
      id: data.playerId,
      name: `${data.playerName}`.trim(),
      profilePhoto: data.profilePhoto ?? null,
    };
    dispatch(setTeamPlayer({ teamIndex, playerIndex, player }));

    const order: { t: number; p: number }[] =
      count === 4
        ? [
            { t: 0, p: 0 },
            { t: 0, p: 1 },
            { t: 1, p: 0 },
            { t: 1, p: 1 },
          ]
        : [
            { t: 0, p: 0 },
            { t: 1, p: 0 },
          ];

    const isNowFilled = (t: number, p: number) => {
      if (t === teamIndex && p === playerIndex) return true;
      const team = t === 0 ? snookerScoring.team1 : snookerScoring.team2;
      return !!team.players[p]?.id;
    };

    const next = order.find(({ t, p }) => !isNowFilled(t, p));
    if (!next) {
      setOpenPlayerSelectCard(false);
    } else {
      setSelectedTeamIndex(next.t);
      setSelectedPlayerIndex(next.p);
    }
  };

  useEffect(() => {
    if (!clubs.activeClub || snookerScoring.matchId !== null) return;
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
  }, [clubs.activeClub?.venueId, snookerScoring.matchId]);

  // HANDLERS
  const handleBackClick = () => handleGoToHome();

  const handleSettingsClick = () => setOpenSettingsDrawer(true);

  const handleTeamClick = async (_teamIndex: number) => {
    const activeSet = getActiveSet(snookerScoring.scoreHistory);

    if (activeSet) {
      return;
    }
    // Break-off team selection is handled only via the break-off dialog
  };

  // Called from break-off dialog to set the active team
  const handleBreakOffTeamSelect = async (teamIndex: number) => {
    await dispatch(handleSelectionOfBreakOffTeam({ teamIndex }));
  };

  const snookerSportTypeToFormat = (
    data: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' | 'BILLIARDS_RACE_TO' | 'BILLIARDS_TIME_BASED',
    isCumulativeScoring: boolean,
  ) => {
    switch (data) {
      case 'SNOOKER_10_RED':
        return `10 REDS${isCumulativeScoring ? ' CUMULATIVE' : ''}`;
      case 'SNOOKER_15_RED':
        return `15 REDS${isCumulativeScoring ? ' CUMULATIVE' : ''}`;
      case 'SNOOKER_6_RED':
        return `6 REDS${isCumulativeScoring ? ' CUMULATIVE' : ''}`;
      default:
        return `15 REDS${isCumulativeScoring ? ' CUMULATIVE' : ''}`;
    }
  };

  const handleMatchCreation = async (playerOrder: string[]) => {
    let isTeamReveresed = false;
    const currentImplementationSnookerScoring = snookerScoring;
    const activeTeam = getActiveTeam(snookerScoring.team1, snookerScoring.team2);

    if (activeTeam === 1) {
      await dispatch(handleReversePlayersState({ reverseOnApi: false }));
      isTeamReveresed = true;
    }

    const teamOneHandicap = isTeamReveresed
      ? currentImplementationSnookerScoring.teamTwoHandicap
      : currentImplementationSnookerScoring.teamOneHandicap;
    const teamTwoHandicap = isTeamReveresed
      ? currentImplementationSnookerScoring.teamOneHandicap
      : currentImplementationSnookerScoring.teamTwoHandicap;

    const currentDate = new Date();
    const expectedEndTimeDate =
      snookerScoring.timeInMinutes !== 0
        ? new Date(currentDate.getTime() + snookerScoring.timeInMinutes * 60000)
        : undefined;
    const matchId = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId,
      expectedEndTimeDate: expectedEndTimeDate,
      sideOnePlayerOneId: isTeamReveresed
        ? currentImplementationSnookerScoring.team2.players[0].id!
        : currentImplementationSnookerScoring.team1.players[0].id!,
      sideTwoPlayerOneId: isTeamReveresed
        ? currentImplementationSnookerScoring.team1.players[0].id!
        : currentImplementationSnookerScoring.team2.players[0].id!,
      sideOnePlayerTwoId:
        currentImplementationSnookerScoring.team1.players.length > 1
          ? isTeamReveresed
            ? currentImplementationSnookerScoring.team2.players[1].id!
            : currentImplementationSnookerScoring.team1.players[1].id!
          : undefined,
      sideTwoPlayerTwoId:
        currentImplementationSnookerScoring.team2.players.length > 1
          ? isTeamReveresed
            ? currentImplementationSnookerScoring.team1.players[1].id!
            : currentImplementationSnookerScoring.team2.players[1].id!
          : undefined,
      sport: 'SNOOKER',
      sportType: snookerScoring.format,
      streamingType: snookerScoring.streaming,
      venueId: clubs.activeClub!.venueId,
      handicap: 0,
      maxScorePerSet: currentImplementationSnookerScoring.maxScorePerSet,
      noOfSets: currentImplementationSnookerScoring.noOfSets,
      cumulativeScoring: currentImplementationSnookerScoring.isCumulativeScoring,
      tournamentTeamOneId:
        currentImplementationSnookerScoring.tournamentTeamOneId !== null &&
        currentImplementationSnookerScoring.tournamentTeamTwoId !== null
          ? isTeamReveresed
            ? currentImplementationSnookerScoring.tournamentTeamTwoId
            : currentImplementationSnookerScoring.tournamentTeamOneId
          : undefined,
      tournamentTeamTwoId:
        currentImplementationSnookerScoring.tournamentTeamOneId !== null &&
        currentImplementationSnookerScoring.tournamentTeamTwoId !== null
          ? isTeamReveresed
            ? currentImplementationSnookerScoring.tournamentTeamOneId
            : currentImplementationSnookerScoring.tournamentTeamTwoId
          : undefined,
      tournamentId: currentImplementationSnookerScoring.tournamentId
        ? currentImplementationSnookerScoring.tournamentId
        : undefined,
      tournamentTeamOneScore: currentImplementationSnookerScoring.tournamentTeamOneScore
        ? currentImplementationSnookerScoring.tournamentTeamOneScore
        : undefined,
      tournamentTeamTwoScore: currentImplementationSnookerScoring.tournamentTeamTwoScore
        ? currentImplementationSnookerScoring.tournamentTeamTwoScore
        : undefined,
      teamOneHandicap: teamOneHandicap != null ? teamOneHandicap : undefined,
      teamTwoHandicap: teamTwoHandicap != null ? teamTwoHandicap : undefined,
      format: currentImplementationSnookerScoring.formatName
        ? currentImplementationSnookerScoring.formatName
        : snookerSportTypeToFormat(
            currentImplementationSnookerScoring.format,
            currentImplementationSnookerScoring.isCumulativeScoring,
          ),
      tournamentSubItemId: currentImplementationSnookerScoring.tournamentSubItemId
        ? currentImplementationSnookerScoring.tournamentSubItemId
        : undefined,
      switchType: snookerScoring.switchType ? snookerScoring.switchType : null,
      isRankingEvent: currentImplementationSnookerScoring.isRankingEvent,
      phase: currentImplementationSnookerScoring.phase,
      isStopClockEnabled: currentImplementationSnookerScoring.isStopClockEnabled,
      stopClockFrameTimeInSeconds: currentImplementationSnookerScoring.isStopClockEnabled
        ? currentImplementationSnookerScoring.stopClockFrameTimeInSeconds
        : undefined,
      stopClockTurnTimeInSeconds: currentImplementationSnookerScoring.isStopClockEnabled
        ? currentImplementationSnookerScoring.stopClockTurnTimeInSeconds
        : undefined,
      stopClockVoiceEnabled: currentImplementationSnookerScoring.isStopClockEnabled
        ? currentImplementationSnookerScoring.stopClockVoiceEnabled
        : undefined,
    });

    if (matchId) {
      await dispatch(
        handleMatchStart({
          matchId,
          scoreOrder: playerOrder,
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
            if (snookerScoring.matchId === null) {
              await handleMatchCreation([
                activeTeamInfo === 0 ? snookerScoring.team1.players[0].id : snookerScoring.team2.players[0].id,
                activeTeamInfo === 0 ? snookerScoring.team2.players[0].id : snookerScoring.team1.players[0].id,
              ]);
              setShowLoadingModal(false);
              return;
            } else {
              await dispatch(
                handleStartTournamentMatch({
                  scoreOrder: [
                    activeTeamInfo === 0 ? snookerScoring.team1.players[0].id : snookerScoring.team2.players[0].id,
                    activeTeamInfo === 0 ? snookerScoring.team2.players[0].id : snookerScoring.team1.players[0].id,
                  ],
                }),
              );
              setShowLoadingModal(false);
              return;
            }
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
    if (!values.breakPlayerId || !values.followThroughPlayerId) {
      toast({
        title: 'Error',
        description: 'Please select both breaking and follow through players',
        variant: 'destructive',
      });
      return;
    }

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
    if (!snookerScoring.matchId && !snookerScoring.tournamentId) {
      // Don't allow player selection during break-off waiting state
      const allSelected = snookerScoring.team1.players.every((p) => p.id !== null) &&
        snookerScoring.team2.players.every((p) => p.id !== null);
      if (allSelected) return;
      setSelectedTeamIndex(teamIndex);
      setSelectedPlayerIndex(playerIndex);
      setOpenPlayerSelectCard(true);
    }
  };

  const onBackInPlayerSelectModal = async () => {
    if (defaultNoOfPlayers === '4') {
      // 4-player back: go to the previous slot in order T1P1 → T1P2 → T2P1 → T2P2
      // Current selection is the slot being filled; go back to the previous one
      if (selectedTeamIndex === 0 && selectedPlayerIndex === 1) {
        // On T1P2 → go back to T1P1
        dispatch(setTeamPlayer({ teamIndex: 0, playerIndex: 0, player: { id: null, name: 'Player 1', profilePhoto: null } }));
        setSelectedTeamIndex(0);
        setSelectedPlayerIndex(0);
      } else if (selectedTeamIndex === 1 && selectedPlayerIndex === 0) {
        // On T2P1 → go back to T1P2
        dispatch(setTeamPlayer({ teamIndex: 0, playerIndex: 1, player: { id: null, name: 'Player 2', profilePhoto: null } }));
        setSelectedTeamIndex(0);
        setSelectedPlayerIndex(1);
      } else if (selectedTeamIndex === 1 && selectedPlayerIndex === 1) {
        // On T2P2 → go back to T2P1
        dispatch(setTeamPlayer({ teamIndex: 1, playerIndex: 0, player: { id: null, name: 'Player 1', profilePhoto: null } }));
        setSelectedTeamIndex(1);
        setSelectedPlayerIndex(0);
      }
    } else {
      // 2-player: on T2P1 → go back to T1P1
      if (snookerScoring.team1.players[0].id !== null) {
        dispatch(setTeamPlayer({ teamIndex: 0, playerIndex: 0, player: { id: null, name: 'Player 1', profilePhoto: null } }));
        setSelectedTeamIndex(0);
        setSelectedPlayerIndex(0);
      }
    }
    setOpenPlayerSelectCard(true);
  };

  const onBackFromSettings = () => {
    // Clear last player (player 2 in 2-player, or team 2 player 2 in 4-player) so user must re-select
    if (defaultNoOfPlayers === '4') {
      dispatch(
        setTeamPlayer({
          teamIndex: 1,
          playerIndex: 1,
          player: { id: null, name: 'Player 2', profilePhoto: null },
        }),
      );
      setSelectedTeamIndex(1);
      setSelectedPlayerIndex(1);
    } else {
      dispatch(
        setTeamPlayer({
          teamIndex: 1,
          playerIndex: 0,
          player: { id: null, name: 'Player 1', profilePhoto: null },
        }),
      );
      setSelectedTeamIndex(1);
      setSelectedPlayerIndex(0);
    }
    setOpenPlayerSelectCard(true);
  };

  const handleRemoveTeamPlayer = (globalIndex: number) => {
    const team1Count = snookerScoring.team1.players.length;
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

  const handlePlayerConfirm = async (player: Player) => {
    let showSettingsScreen = false;

    // Detect if this is the last player being selected
    if (defaultNoOfPlayers === '4') {
      if (selectedTeamIndex === 1 && selectedPlayerIndex === 1) {
        showSettingsScreen = true;
      }
    } else {
      if (selectedTeamIndex === 1 && snookerScoring.team2.players[0].id === null) {
        showSettingsScreen = true;
      }
    }

    await dispatch(
      await handlePlayerSelectState({
        player,
        playerIndex: selectedPlayerIndex,
        teamIndex: selectedTeamIndex,
      }),
    );

    // 2-player: T1P1 → T2P1 → done
    // 4-player: T1P1 → T1P2 → T2P1 → T2P2 → done (complete Team 1 first)
    if (defaultNoOfPlayers === '4') {
      if (selectedTeamIndex === 0 && selectedPlayerIndex === 0) {
        setSelectedPlayerIndex(1); // T1P1 → T1P2
      } else if (selectedTeamIndex === 0 && selectedPlayerIndex === 1) {
        setSelectedTeamIndex(1);
        setSelectedPlayerIndex(0); // T1P2 → T2P1
      } else if (selectedTeamIndex === 1 && selectedPlayerIndex === 0) {
        setSelectedPlayerIndex(1); // T2P1 → T2P2
      } else {
        setOpenPlayerSelectCard(false); // T2P2 → done
      }
    } else {
      if (selectedTeamIndex === 0 && snookerScoring.team2.players[0].id === null) {
        setSelectedTeamIndex(1);
        setSelectedPlayerIndex(0); // T1P1 → T2P1
      } else {
        setOpenPlayerSelectCard(false);
      }
    }

    if (showSettingsScreen) {
      setOpenSettingsDrawer(true);
    }
  };

  const handleFoulUpdate = async (values: SnookerFoulData) => {
    await dispatch(handleFoulScore(values));
    setOpenFoulDrawer(false);
  };

  const handleSettingsUpdate = async (values: SnookerPracticeSettingsData) => {
    await dispatch(handleSettingsStateUpdate(values));
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
    setShowMenuDrawer(false);

    const activeSet = getActiveSet(snookerScoring.scoreHistory);
    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    setShowLoadingModal(false);
  };

  const handleEndGame = async () => {
    setShowLoadingModal(true);
    setShowMenuDrawer(false);

    try {
      await dispatch(handleEndGameThrunk({}));

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

  const handleTimerButtonAction = async (state: 'CONFIRM' | 'CANCEL') => {
    if (state === 'CONFIRM') {
      setShowLoadingModal(true);

      const newEndTimeDate = addMillisecondsToUTC(snookerScoring.expectedEndTimeDate!, 30 * 60 * 1000);

      await matchResetTimerRequest({
        matchId: snookerScoring.matchId!,
        expectedEndTimeDate: new Date(newEndTimeDate),
      });

      dispatch(setExpectedEndTimeDate({ expectedEndTimeDate: newEndTimeDate }));

      setShowLoadingModal(false);
    } else {
      await handleEndGame();
    }
    setShowTimeModal(false);
  };

  // Frame must have started (Break Off already pressed, which fires START_FRAME) before the
  // shot clock is allowed to start — otherwise the shot clock would be running against a frame
  // that hasn't officially begun.
  const isStopClockFrameStarted = !!snookerScoring.stopClockState?.frameStartedAt;

  // Purely local — no API call, no network round trip. The button disables only while the
  // frame hasn't started yet (Break Off not pressed); once it's clickable, the toggle is instant.
  // Still has to mark the state dirty so the existing 1s poll (handleBackendUpdateOfData) picks
  // up the changed turn and pushes it on — otherwise the venue scoreboard/stream overlay, which
  // only learn about turn changes via that sync, would never see the shot clock start/stop.
  const handleStopClockToggle = () => {
    if (!isStopClockFrameStarted) return;
    dispatch(toggleTurnClock());
    dispatch(changeBackendUpdatedState({ value: false }));
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
    handleBreakOffTeamSelect,
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
    teamActiveSetPoints,
    onBackInPlayerSelectModal,
    onBackFromSettings,
    handleRemoveTeamPlayer,
    showTimerModal,
    handleTimerButtonAction,
    defaultNoOfPlayers,
    stopClockTick,
    isStopClockRunning,
    isStopClockFrameStarted,
    handleStopClockToggle,
  };
};

export default useSnookerScoring;
