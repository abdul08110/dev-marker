import { MarkerNavigation } from '@/components/sections/scoring/markerNavigation';
import { MaxScore } from '@/components/sections/scoring/maxScore';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerScoringButtonEnum, SnookerScoringButtons } from '@/components/sections/scoring/snookerScoringButtons';
import TimeManager from '@/components/sections/scoring/timeManager';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/stores';
import { toast } from '@/components/ui/use-toast';
import { Player, PointType } from '@/stores/types';
import useStartMatch from '@/api/app/useStartMatch';
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
  handleSelectionOfActiveTeam,
  handleSettingsStateUpdate,
  handleStartNewFrame,
  handleUndoScoreClicked,
} from '@/stores/thunks/snookerThunks';
import { SnookerFoulDrawer } from '@/components/modals/snookerFoulDrawer';
import { SnookerFoulData } from '@/components/forms/app/snookerFoul';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import { SnookerPracticeSettingsDrawer } from '@/components/modals/snookerPracticeSettingsDrawer';
import { SnookerPracticeSettingsData } from '@/components/forms/app/snookerPracticeSettings';
import {
  getActivePlayer,
  getActiveSet,
  getActiveTeam,
  getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex,
} from '@/stores/selectors/commonSport';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { TextHeader } from '@/components/sections/scoring/textHeader';
import { Statistics } from '@/components/sections/scoring/statistics';
import { Breaks } from '@/components/sections/scoring/breaks';
import { PlayerSelectModal } from '@/components/modals/playerSelectModal';
import useTimer from '@/hooks/useTimer';

export function SnookerScoring() {
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

  const dispatch = useAppDispatch();

  // API
  const startMatchHook = useStartMatch();

  // LOCAL STATE
  const navigate = useNavigate();
  const [openFoulDrawer, setOpenFoulDrawer] = React.useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);
  const [openPlayerSelectCard, setOpenPlayerSelectCard] = React.useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);

  // REACT HOOKS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  // TIMER HOOKS
  const { timeLeft, startTimer, pauseTimer, resetTimer } = useTimer(snookerScoring.timeInMinutes, () => {
    // Logic to handle when timer completes
  });

  // HANDLERS
  const handleBackClick = () => {
    navigate('/');
  };
  const handleSettingsClick = () => {
    setOpenSettingsDrawer(true);
  };
  const handleStartTimer = () => {
    startTimer();
  };
  const handleTeamClick = async (teamIndex: number) => {
    await dispatch(handleSelectionOfActiveTeam({ teamIndex }));
  };
  const handleScoringButtonExecution = async (point: number, type: PointType) => {
    if (getActiveSet(snookerScoring.scoreHistory)?.status === 'COMPLETED') {
      toast({
        title: 'Frame completed',
        description: 'Please click on start frame to begin',
        variant: 'destructive',
      });
      return;
    }

    const activeTeams = getActiveTeam(snookerScoring.players.team1, snookerScoring.players.team2);
    if (activeTeams.team1Active === false && activeTeams.team2Active === false) {
      toast({
        title: 'Error',
        description: 'Please Select Team First',
        variant: 'destructive',
      });
      return;
    } else {
      await dispatch(handleChangeScoreOnTrigger({ point, type }));
    }
  };
  const handleScoringButtonClick = async (buttonType: SnookerScoringButtonEnum) => {
    if (snookerScoring.players.team1.players[0].id === null || snookerScoring.players.team2.players[0].id === null) {
      toast({
        title: 'Error',
        description: 'Please Select Player First',
        variant: 'destructive',
      });
      return;
    }
    switch (buttonType) {
      case SnookerScoringButtonEnum.START_FRAME:
        if (!snookerScoring.matchId) {
          const activeTeamInfo = getActiveTeam(snookerScoring.players.team1, snookerScoring.players.team2);

          if (activeTeamInfo.team1Active || activeTeamInfo.team2Active) {
            const matchId = await startMatchHook.startMatch({
              expectedEndTimeDate: new Date(new Date(new Date().getTime() + 30 * 60000).toISOString()),
              clubId: clubs.activeClub!.clubId,
              sport: 'SNOOKER',
              sportType: snookerScoring.format,
              venueId: clubs.activeClub!.venueId,
              sideOnePlayerOneId: snookerScoring.players.team1.players[0].id,
              sideOnePlayerTwoId:
                snookerScoring.players.team1.players[1] && snookerScoring.players.team1.players[1].id
                  ? snookerScoring.players.team1.players[1]!.id
                  : undefined,
              sideTwoPlayerOneId: snookerScoring.players.team2.players[0].id,
              sideTwoPlayerTwoId:
                snookerScoring.players.team2.players[1] && snookerScoring.players.team2.players[1].id
                  ? snookerScoring.players.team2.players[1]!.id
                  : undefined,
              streamingType: snookerScoring.streaming,
              noOfSets: snookerScoring.numberOfFrames,
            });

            if (matchId) {
              await dispatch(handleMatchStart({ matchId }));
              handleStartTimer();
            }
          } else {
            toast({
              title: 'Error',
              description: 'Select Team to Break',
              variant: 'destructive',
            });
          }
          break;
        } else {
          await dispatch(handleStartNewFrame({}));
        }
        break;
      case SnookerScoringButtonEnum.RED:
        console.log('red clicked');
        await handleScoringButtonExecution(1, PointType.RED);
        break;
      case SnookerScoringButtonEnum.YELLOW:
        console.log('yellow clicked');
        await handleScoringButtonExecution(2, PointType.YELLOW);
        break;
      case SnookerScoringButtonEnum.GREEN:
        console.log('green clicked');
        await handleScoringButtonExecution(3, PointType.GREEN);
        break;
      case SnookerScoringButtonEnum.BROWN:
        console.log('brown clicked');
        await handleScoringButtonExecution(4, PointType.BROWN);
        break;
      case SnookerScoringButtonEnum.BLUE:
        console.log('blue clicked');
        await handleScoringButtonExecution(5, PointType.BLUE);
        break;
      case SnookerScoringButtonEnum.PINK:
        console.log('pink clicked');
        await handleScoringButtonExecution(6, PointType.PINK);
        break;
      case SnookerScoringButtonEnum.BLACK:
        console.log('black clicked');
        await handleScoringButtonExecution(7, PointType.BLACK);
        break;
      case SnookerScoringButtonEnum.UNDO_SCORE:
        console.log('Undo Score Clicked');
        await dispatch(handleUndoScoreClicked({}));
        break;
      case SnookerScoringButtonEnum.FOUL:
        console.log('Foul Clicked');
        setOpenFoulDrawer(true);
        break;
      case SnookerScoringButtonEnum.END_FRAME:
        console.log('End Frame Clicked');
        await dispatch(handleEndFrame({}));
        break;
      default:
        return;
    }
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
      handlePlayerSelectState({
        player,
        playerIndex: selectedPlayerIndex,
        teamIndex: selectedTeamIndex,
      }),
    );
    setOpenPlayerSelectCard(false);

    if (snookerScoring.players.team2.players[0].id === null && selectedTeamIndex === 0) {
      setTimeout(() => {
        handlePlayerSelect(0, 1);
      }, 500);
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

  // PARENT UI
  return (
    <section>
      <Tabs defaultValue="scoring" className="flex flex-col justify-start h-screen overflow-y-scroll">
        <TabsContent value="scoring" className="flex-grow mt-0">
          <div className="flex flex-col gap-6 h-full">
            <ScoringHeader onBackClick={handleBackClick} onSettingsClick={handleSettingsClick} />
            <TimeManager timeLeft={timeLeft} />
            <PlayerTeamManager
              onPlayerButtonClick={handlePlayerSelect}
              activeTurnScore={activeTurnPointScore}
              activeTurnPointTypes={activeTurnPointTypes}
              team1SetScore={team1score}
              team2SetScore={team2score}
              onTeamClick={handleTeamClick}
              team1={snookerScoring.players.team1}
              team2={snookerScoring.players.team2}
              matchId={snookerScoring.matchId}
            />
            <SnookerFramesSummary
              maxRounds={snookerScoring.numberOfFrames}
              team1Score={snookerScoring.team1Score}
              team2Score={snookerScoring.team2Score}
            />
            <MaxScore numberAhead={snookerScoring.numberAhead} numberOn={snookerScoring.numberOn} />
            <SnookerScoringButtons
              isBreakOff={snookerScoring.scoreHistory.length === 0}
              disabledState={snookerButtonDisabledState}
              onButtonClick={handleScoringButtonClick}
            />
            <SnookerFoulDrawer
              foulByPlayerName={getActivePlayer(snookerScoring.players.team1, snookerScoring.players.team2)}
              redsOnTable={numberOfRedsOnTable}
              onSubmit={handleFoulUpdate}
              open={openFoulDrawer}
              setOpen={setOpenFoulDrawer}
            />
            <SnookerPracticeSettingsDrawer
              onSubmit={handleSettingsUpdate}
              open={openSettingsDrawer}
              setOpen={setOpenSettingsDrawer}
            />
            <PlayerSelectModal
              disabledPlayerList={getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex(
                snookerScoring.players.team1,
                snookerScoring.players.team2,
                selectedTeamIndex,
                selectedPlayerIndex,
              )}
              closeModal={() => setOpenPlayerSelectCard(false)}
              onPlayerConfirm={handlePlayerConfirm}
              clubId={clubs.activeClub?.clubId!}
              teamIndex={selectedTeamIndex}
              playerIndex={selectedPlayerIndex}
              isModalOpen={openPlayerSelectCard}
            />
          </div>
        </TabsContent>
        <TabsContent value="stats" className="mt-0">
          <div className="flex flex-col gap-6 h-full">
            <TextHeader name="STATISTICS" />
            <Statistics
              teamOnePOSN={posnScores.team1POSN}
              teamTwoPOSM={posnScores.team2POSN}
              teamOneAverage={`${posnScores.team1PottedBalls}/${posnScores.team1TotalBallsPlayed}`}
              teamTwoAverage={`${posnScores.team2PottedBalls}/${posnScores.team2TotalBallsPlayed}`}
            />
          </div>
        </TabsContent>
        <TabsContent value="breaks" className="mt-0">
          <div className="flex flex-col gap-6 h-full">
            <TextHeader name="BREAKS" />
            <Breaks team1Breaks={team1HighestTurnScores} team2Breaks={team2HighestTurnScores} />
          </div>
        </TabsContent>
        <TabsList className="h-auto bg-transparent mt-auto">
          <MarkerNavigation />
        </TabsList>
      </Tabs>
    </section>
  );
}
