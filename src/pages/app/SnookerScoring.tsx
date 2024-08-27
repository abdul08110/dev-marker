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
import { getActiveTeam, getActiveTurnPointTypes, getActiveTurnScore, getTeamSetScores, selectNumberAheadAndNumberOn } from "@/stores/selectors/snookerSelector";
import { handleChangeScoreOnTrigger, handleFoulScore, handleFrameCompleted, handleMatchStart, handlePlayerSelectState, handleSelectionOfActiveTeam, handleSettingsStateUpdate, handleUndoScoreClicked } from "@/stores/thunks/snookerThunks";
import { SnookerFoulDrawer } from "@/components/modals/snookerFoulDrawer";
import { SnookerFoulData } from "@/components/forms/app/snookerFoul";
import { SnookerFramesSummary } from "@/components/sections/scoring/snookerFrameSummary";
import { SnookerPracticeSettingsDrawer } from "@/components/modals/snookerPracticeSettingsDrawer";
import { SnookerPracticeSettingsData } from "@/components/forms/app/snookerPracticeSettings";

export function SnookerScoring() {
    // STATE
    const snookerScoring = useSelector((state: RootState) => state.snooker);
    const clubs = useSelector((state: RootState) => state.club);
    const { numberAhead, numberOn } = useSelector(selectNumberAheadAndNumberOn);
    const { team1score, team2score } = useSelector(getTeamSetScores);
    const activeTurnPointTypes = useSelector(getActiveTurnPointTypes);
    const activeTurnPointScore = useSelector(getActiveTurnScore);

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

    // HANDLERS
    const handleBackClick = () => {
        navigate('/');
    };
    const handleSettingsClick = () => {
        if (snookerScoring.matchId === null) {
            setOpenSettingsDrawer(true);
        }
    };
    const startTimer = () => {
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

            if (numberOn === 0) {
                toast({
                    title: "Frame Completed",
                    className: 'bg-white'
                });
                await dispatch(handleFrameCompleted({}));
            }
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
        if (snookerScoring.scoreHistory.length > 0 && snookerScoring.scoreHistory[snookerScoring.scoreHistory.length - 1].status === 'COMPLETED') {
            toast({
                title: "Match Completed",
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
                        startTimer();
                    }
                    break;
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
        <section className="flex flex-col justify-start h-screen gap-6 overflow-y-scroll">
            <ScoringHeader onBackClick={handleBackClick} onSettingsClick={handleSettingsClick} />
            <TimeManager ref={timerRef} initialTime={snookerScoring.timeInMinutes} onTimerComplete={handleTimerComplete} />
            <PlayerTeamManager activeTurnScore={activeTurnPointScore} activeTurnPointTypes={activeTurnPointTypes} team1SetScore={team1score} team2SetScore={team2score} onPlayerSelect={handlePlayerSelect} onTeamClick={handleTeamClick} team1={snookerScoring.players.team1} team2={snookerScoring.players.team2} matchId={snookerScoring.matchId} />
            <SnookerFramesSummary team1Score={snookerScoring.team1Score} team2Score={snookerScoring.team2Score} />
            <MaxScore numberAhead={numberAhead} numberOn={numberOn} />
            <SnookerScoringButtons
                onButtonClick={handleScoringButtonClick}
            />
            <MarkerNavigation />
            <SnookerFoulDrawer onSubmit={handleFoulUpdate} open={openFoulDrawer} setOpen={setOpenFoulDrawer} />
            <SnookerPracticeSettingsDrawer onSubmit={handleSettingsUpdate} open={openSettingsDrawer} setOpen={setOpenSettingsDrawer} />
        </section>
    )
}