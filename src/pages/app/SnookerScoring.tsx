import { MarkerNavigation } from "@/components/sections/scoring/markerNavigation";
import { MaxScore } from "@/components/sections/scoring/maxScore";
import { PlayerTeamManager } from "@/components/sections/scoring/playerTeamManager";
import { ScoringHeader } from "@/components/sections/scoring/scoringHeader";
import { SnookerScoringButtonEnum, SnookerScoringButtons } from "@/components/sections/scoring/snookerScoringButtons";
import TimeManager, { TimeManagerHandle } from "@/components/sections/scoring/timeManager";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/stores';
import { toast } from '@/components/ui/use-toast';
import { Player, PointType } from "@/stores/types";
import useStartMatch from "@/api/app/useStartMatch";
import { calculateTeamPOSN, getActiveTurnPointTypes, getActiveTurnScore, getTeamSetScores, selectHighestTurnScores } from "@/stores/selectors/snookerSelector";
import { handleChangeScoreOnTrigger, handleFoulScore, handleMatchStart, handleNewSet, handlePlayerSelectState, handleSelectionOfActiveTeam, handleSettingsStateUpdate, handleUndoScoreClicked } from "@/stores/thunks/snookerThunks";
import { SnookerFoulDrawer } from "@/components/modals/snookerFoulDrawer";
import { SnookerFoulData } from "@/components/forms/app/snookerFoul";
import { SnookerFramesSummary } from "@/components/sections/scoring/snookerFrameSummary";
import { SnookerPracticeSettingsDrawer } from "@/components/modals/snookerPracticeSettingsDrawer";
import { SnookerPracticeSettingsData } from "@/components/forms/app/snookerPracticeSettings";
import { getActiveSet, getActiveTeam } from "@/stores/selectors/commonSport";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { TextHeader } from "@/components/sections/scoring/textHeader";
import { Statistics } from "@/components/sections/scoring/statistics";
import { Breaks } from "@/components/sections/scoring/breaks";
import { startTimer } from "@/stores/slices/snookerSlice";


export function SnookerScoring() {
    // STATE
    const snookerScoring = useSelector((state: RootState) => state.snooker);
    const clubs = useSelector((state: RootState) => state.club);
    const { team1score, team2score } = useSelector(getTeamSetScores);
    const activeTurnPointTypes = useSelector(getActiveTurnPointTypes);
    const activeTurnPointScore = useSelector(getActiveTurnScore);
    const posnScores = useSelector(calculateTeamPOSN);
    const { team1HighestTurnScores, team2HighestTurnScores } = useSelector(selectHighestTurnScores);


    const dispatch = useAppDispatch();

    // API
    const startMatchHook = useStartMatch();

    // LOCAL STATE
    const timerRef = useRef<TimeManagerHandle>(null);
    const navigate = useNavigate();
    const [openFoulDrawer, setOpenFoulDrawer] = React.useState(false);
    const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);

    // REACT HOOKS
    useEffect(() => {
        if (clubs.activeClub === null) {
            navigate('/');
        }
    }, [clubs.activeClub, navigate]);

    useEffect(() => {
        if (snookerScoring.isTimerRunning && timerRef.current) {
            timerRef.current.startTimer();
        } else if (!snookerScoring.isTimerRunning && timerRef.current) {
            timerRef.current.pauseTimer();
        }
    }, [snookerScoring.isTimerRunning]);

    // HANDLERS
    const handleBackClick = () => {
        navigate('/');
    };
    const handleSettingsClick = () => {
        if (snookerScoring.matchId === null) {
            setOpenSettingsDrawer(true);
        }
    };
    const handleStartTimer = () => {
        dispatch(startTimer());
        if (timerRef.current) {
            timerRef.current.startTimer();
        }
    };


    const handleTimerComplete = () => {
    };
    const handleTeamClick = async (teamIndex: number) => {
        await dispatch(handleSelectionOfActiveTeam({ teamIndex }));
    }
    const handleScoringButtonExecution = async (point: number, type: PointType) => {
        if (getActiveSet(snookerScoring.scoreHistory)?.status === 'COMPLETED') {
            toast({
                title: "Frame completed",
                description: "Please click on start frame to begin",
                variant: "destructive",
            });
            return
        }

        const activeTeams = getActiveTeam(snookerScoring.players.team1, snookerScoring.players.team2);
        if (activeTeams.team1Active === false && activeTeams.team2Active === false) {
            toast({
                title: "Error",
                description: "Please Select Team First",
                variant: "destructive",
            });
            return
        } else {
            await dispatch(handleChangeScoreOnTrigger({ point, type }));
        }

    }
    const handleScoringButtonClick = async (buttonType: SnookerScoringButtonEnum) => {
        if (snookerScoring.players.team1.players[0].id === null || snookerScoring.players.team2.players[0].id === null) {
            toast({
                title: "Error",
                description: "Please Select Player First",
                variant: "destructive",
            });
            return;
        }
        switch (buttonType) {
            case SnookerScoringButtonEnum.START_FRAME:
                console.log('start frame clicked clicked');
                if (!snookerScoring.matchId) {
                    const matchId = await startMatchHook.startMatch({
                        expectedEndTimeDate: new Date(new Date(new Date().getTime() + 30 * 60000).toISOString()),
                        clubId: clubs.activeClub!.clubId,
                        sport: 'SNOOKER',
                        sportType: snookerScoring.format,
                        venueId: clubs.activeClub!.venueId,
                        sideOnePlayerOneId: snookerScoring.players.team1.players[0].id,
                        sideOnePlayerTwoId: snookerScoring.players.team1.players[1] && snookerScoring.players.team1.players[1].id ? snookerScoring.players.team1.players[1]!.id : undefined,
                        sideTwoPlayerOneId: snookerScoring.players.team2.players[0].id,
                        sideTwoPlayerTwoId: snookerScoring.players.team2.players[1] && snookerScoring.players.team2.players[1].id ? snookerScoring.players.team2.players[1]!.id : undefined,
                        streamingType: snookerScoring.streaming,
                        noOfSets: snookerScoring.numberOfFrames
                    })

                    if (matchId) {
                        await dispatch(handleMatchStart({ matchId }));
                        handleStartTimer();
                    }
                    break;
                } else {
                    const activeSet = getActiveSet(snookerScoring.scoreHistory);
                    if (activeSet && activeSet.status === 'COMPLETED') {
                        await dispatch(handleNewSet({}));
                    } else {
                        toast({
                            title: "Error",
                            description: "Complete ongoing frame",
                            variant: "destructive",
                        });
                    }
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
            default:
                return;
        }
    }
    const handlePlayerSelect = async (player: Player, playerIndex: number, teamIndex: number) => {
        await dispatch(handlePlayerSelectState({ player, playerIndex, teamIndex }));
    }
    const handleFoulUpdate = async (values: SnookerFoulData) => {
        await dispatch(handleFoulScore(values));
        setOpenFoulDrawer(false);
    }
    const handleSettingsUpdate = async (values: SnookerPracticeSettingsData) => {
        await dispatch(handleSettingsStateUpdate(values));
        setOpenSettingsDrawer(false);
    }

    // PARENT UI
    return (
        <section>
            <Tabs defaultValue="scoring" className="flex flex-col justify-start h-screen gap-6 overflow-y-scroll">
                <TabsContent value="scoring" className="h-[90%]">
                    <div className="flex flex-col gap-6 h-full">
                        <ScoringHeader onBackClick={handleBackClick} onSettingsClick={handleSettingsClick} />
                        <TimeManager ref={timerRef} initialTime={snookerScoring.timeInMinutes} onTimerComplete={handleTimerComplete} />
                        <PlayerTeamManager activeTurnScore={activeTurnPointScore} activeTurnPointTypes={activeTurnPointTypes} team1SetScore={team1score} team2SetScore={team2score} onPlayerSelect={handlePlayerSelect} onTeamClick={handleTeamClick} team1={snookerScoring.players.team1} team2={snookerScoring.players.team2} matchId={snookerScoring.matchId} />
                        <SnookerFramesSummary team1Score={snookerScoring.team1Score} team2Score={snookerScoring.team2Score} />
                        <MaxScore numberAhead={snookerScoring.numberAhead} numberOn={snookerScoring.numberOn} />
                        <SnookerScoringButtons
                            onButtonClick={handleScoringButtonClick}
                        />
                        <SnookerFoulDrawer onSubmit={handleFoulUpdate} open={openFoulDrawer} setOpen={setOpenFoulDrawer} />
                        <SnookerPracticeSettingsDrawer onSubmit={handleSettingsUpdate} open={openSettingsDrawer} setOpen={setOpenSettingsDrawer} />
                    </div>
                </TabsContent>
                <TabsContent value="stats" className="h-[90%]">
                    <div className="flex flex-col gap-6 h-full">
                        <TextHeader name="STATISTICS" />
                        <Statistics teamOnePOSN={posnScores.team1POSN} teamTwoPOSM={posnScores.team2POSN} teamOneAverage={`${posnScores.team1PottedBalls}/${posnScores.team1TotalBallsPlayed}`} teamTwoAverage={`${posnScores.team2PottedBalls}/${posnScores.team2TotalBallsPlayed}`} />
                    </div>

                </TabsContent>
                <TabsContent value="breaks" className="h-[90%]">
                    <div className="flex flex-col gap-6 h-full">
                        <TextHeader name="BREAKS" />
                        <Breaks team1Breaks={team1HighestTurnScores} team2Breaks={team2HighestTurnScores} />
                    </div>
                </TabsContent>
                <TabsList className="h-auto bg-transparent">
                    <MarkerNavigation />
                </TabsList>
            </Tabs>
        </section>
    )
}