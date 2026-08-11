import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerScoringButtons } from '@/components/sections/scoring/snookerScoringButtons';
import TimeManager from '@/components/sections/scoring/timeManager';
import { SnookerFoulDrawer } from '@/components/modals/snookerFoulDrawer';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import { SnookerPracticeSettingsDrawer } from '@/components/modals/snookerPracticeSettingsDrawer';
import {
  getActivePlayer,
  getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex,
} from '@/stores/selectors/commonSport';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EndGameModal } from '@/components/modals/endGameModal';
import { SelectPlayerDrawer } from '@/components/modals/selectPlayerDrawer';
import { BreakOffPlayerStep } from '@/components/modals/breakOffPlayerStep';
import useSnookerScoring from '@/hooks/useSnookerScoring';
import useSelectPlayer from '@/api/app/useSelectPlayer';
import { Player } from '@/stores/types';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { OnlineOfflineIndicator } from '@/components/sections/scoring/onlineOfflineIndicator';
import { PlayerOrderSelectModal } from '@/components/modals/playerOrderSelectModal';
import { SnookerMenuDrawer } from '@/components/modals/SnookerMenuDrawer';
import { SnookerScoreCorrectionDrawer } from '@/components/modals/snookerCorrectionDrawer';
import { getNumberOfRedsFromFormat } from '@/stores/selectors/snookerSelector';
import { SnookerScoreConcedeFrameDrawer } from '@/components/modals/snookerConcedeFrameDrawer';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { TimerContinueModal } from '@/components/modals/timerContinueModal';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getRandomPlaceholderProfileImage } from '@/lib/utils';
import { decimalMinutesToTimeString } from '@/utils/functions';

export function SnookerScoring() {
  const {
    clubs,
    snookerScoring,
    timeLeft,
    showEndGameModal,
    setShowEndGameModal,
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
    activeTurnPointScore,
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
    handleRerack,
    handleCorrection,
    showCorrectionDrawer,
    setShowCorrectionDrawer,
    handleConcedeFrameSelection,
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
    handleStopClockToggle,
    isFrameClockRunning,
    isFrameClockAvailable,
    handleFrameClockToggle,
  } = useSnookerScoring();

  const [searchParams] = useSearchParams();
  const playerCount = Number(searchParams.get('playerCount') ?? '2') as 2 | 4;
  const { selectPlayer } = useSelectPlayer();
  const [defaultImages] = React.useState(() => Array.from({ length: 4 }, () => getRandomPlaceholderProfileImage()));

  const handlePlayerConfirmWithApi = async (player: Player) => {
    const teamIdx = selectedTeamIndex;
    const playerIdx = selectedPlayerIndex;
    await handlePlayerConfirm(player);
    if (clubs.activeClub && player.id) {
      const playerNumber = playerCount === 2 ? teamIdx + 1 : teamIdx * 2 + playerIdx + 1;
      try {
        await selectPlayer({ venueId: clubs.activeClub.venueId, playerNumber, userId: player.id });
      } catch {
        // Ignore "player already added" errors during back-navigation re-selection
      }
    }
  };

  const [showEndFrameAlert, setShowEndFrameAlert] = React.useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = React.useState(false);
  const [showCloseConfirmDialog, setShowCloseConfirmDialog] = React.useState(false);
  const closeConfirmSource = React.useRef<'player' | 'settings' | null>(null);

  const [settingsHasBack, setSettingsHasBack] = React.useState(false);

  const handleSettingsClickIntercepted = () => {
    if (openPlayerSelectCard) {
      setOpenPlayerSelectCard(false);
      setSettingsHasBack(true);
    } else {
      setSettingsHasBack(false);
    }
    handleSettingsClick();
  };

  const handleSettingsBackClick = () => {
    setOpenSettingsDrawer(false);
    onBackFromSettings();
  };

  const prevOpenPlayerSelectRef = React.useRef(openPlayerSelectCard);
  React.useEffect(() => {
    if (openSettingsDrawer && prevOpenPlayerSelectRef.current) {
      setSettingsHasBack(true);
    }
    prevOpenPlayerSelectRef.current = openPlayerSelectCard;
  }, [openSettingsDrawer, openPlayerSelectCard]);

  const handlePlayerDrawerClose = () => {
    const allRequired =
      snookerScoring.team1.players.every((p) => p.id !== null) &&
      snookerScoring.team2.players.every((p) => p.id !== null);
    if (allRequired) {
      return;
    }
    if (snookerScoring.team1.players[0].id !== null) {
      closeConfirmSource.current = 'player';
      setShowCloseConfirmDialog(true);
      return;
    }
    handleGoToHome();
  };

  const handleSettingsDrawerClose = () => {
    if (snookerScoring.matchId === null) {
      closeConfirmSource.current = 'settings';
      setShowCloseConfirmDialog(true);
    }
  };

  const getTeamLabel = (players: typeof snookerScoring.team1.players) => {
    const names = players.map((p) => p.name).filter(Boolean);
    return names.length > 0 ? names.join(' / ') : undefined;
  };

  const [showBreakOffDialog, setShowBreakOffDialog] = React.useState(false);
  const [selectedBreakOffTeamIdx, setSelectedBreakOffTeamIdx] = React.useState<number | null>(null);

  const pendingBreakOff = React.useRef(false);
  const handleScoringButtonClickRef = React.useRef(handleScoringButtonClick);
  React.useEffect(() => {
    handleScoringButtonClickRef.current = handleScoringButtonClick;
  });

  React.useEffect(() => {
    if (pendingBreakOff.current && getActiveTeam(snookerScoring.team1, snookerScoring.team2) !== null) {
      pendingBreakOff.current = false;
      handleScoringButtonClickRef.current(SnookerScoringButtonEnum.BREAK_OFF);
    }
  }, [snookerScoring.team1, snookerScoring.team2]);

  const handleScoringButtonClickWithGuard = async (buttonType: SnookerScoringButtonEnum) => {
    if (
      buttonType === SnookerScoringButtonEnum.BREAK_OFF &&
      snookerScoring.scoreHistory.length === 0 &&
      getActiveTeam(snookerScoring.team1, snookerScoring.team2) === null
    ) {
      if (playerCount === 4) {
        // 4-player: skip "Who is breaking off?" dialog, go directly to player order modal
        pendingBreakOff.current = true;
        await handleBreakOffTeamSelect(0);
        return;
      }
      setSelectedBreakOffTeamIdx(null);
      setShowBreakOffDialog(true);
      return;
    }
    handleScoringButtonClick(buttonType);
  };

  const handleBreakOffConfirm = async () => {
    if (selectedBreakOffTeamIdx === null) return;
    setShowBreakOffDialog(false);
    pendingBreakOff.current = true;
    await handleBreakOffTeamSelect(selectedBreakOffTeamIdx);
  };

  // PARENT UI
  return (
    <section>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          <EndGameModal
            isModalOpen={showEndGameModal}
            confirmModal={() => handleGoToHome()}
            closeModal={() => setShowEndGameModal(false)}
          />
          <ScoreUpdateLoadingModal isModalOpen={showLoadingModal} />
          <div className="flex flex-col justify-start h-dvh overflow-y-auto">
            <div className="flex flex-col gap-4 h-full">
              <ScoringHeader
                onBackClick={handleBackClick}
                onMenuClick={() => setShowMenuDrawer(true)}
                onSettingsClick={handleSettingsClickIntercepted}
                showMenu={getActiveSet(snookerScoring.scoreHistory) !== undefined || snookerScoring.matchId !== null}
                showUndo={snookerScoring.matchId !== null}
                onUndoClick={() => handleUndoButtonClick()}
              />
              <OnlineOfflineIndicator isOnline={isOnline} />
              <TimeManager timeLeft={timeLeft} size={'small'} />
              <PlayerTeamManager
                onPlayerButtonClick={handlePlayerSelect}
                activeTurnScore={activeTurnPointScore}
                activeTurnPointTypes={teamActiveSetPoints}
                team1SetScore={team1score}
                team2SetScore={team2score}
                onTeamClick={handleTeamClick}
                team1={snookerScoring.team1}
                team2={snookerScoring.team2}
                matchId={snookerScoring.matchId}
                showBilliardsButtons={false}
              />
              <SnookerFramesSummary team1Score={snookerScoring.team1Score} team2Score={snookerScoring.team2Score} />
              {/* <MaxScore numberAhead={snookerScoring.numberAhead!} numberOn={snookerScoring.numberOn!} /> */}
              <SnookerScoringButtons
                isLongEnabled={isLongActive}
                onLongClick={() => setIsLongActive(!isLongActive)}
                isBreakOff={!getActiveSet(snookerScoring.scoreHistory)}
                disabledState={snookerButtonDisabledState}
                onButtonClick={handleScoringButtonClickWithGuard}
                isStopClockEnabled={snookerScoring.isStopClockEnabled}
                isStopClockRunning={isStopClockRunning}
                shotRemainingSeconds={Math.ceil(stopClockTick.currentTurnRemainingTimeInMs / 1000)}
                isStopClockToggleDisabled={!isFrameClockRunning}
                onStopClockToggle={handleStopClockToggle}
                frameRemainingMs={stopClockTick.remainingFrameTimeInMs}
                isFrameClockRunning={isFrameClockRunning}
                isFrameClockToggleDisabled={!isFrameClockAvailable}
                onFrameClockToggle={handleFrameClockToggle}
              />
              <SnookerFoulDrawer
                foulByPlayerName={getActivePlayer(snookerScoring.team1, snookerScoring.team2)}
                redsOnTable={numberOfRedsOnTable}
                onSubmit={handleFoulUpdate}
                open={openFoulDrawer}
                setOpen={setOpenFoulDrawer}
              />
              <SnookerPracticeSettingsDrawer
                onSubmit={handleSettingsUpdate}
                open={openSettingsDrawer}
                setOpen={setOpenSettingsDrawer}
                defaultNoOfPlayers={defaultNoOfPlayers}
                teamOneLabel={getTeamLabel(snookerScoring.team1.players)}
                teamTwoLabel={getTeamLabel(snookerScoring.team2.players)}
                showBack={settingsHasBack}
                onBack={handleSettingsBackClick}
                onClose={handleSettingsDrawerClose}
                currentValues={{
                  format: snookerScoring.format as 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED',
                  durationInMinutes: decimalMinutesToTimeString(snookerScoring.timeInMinutes),
                  streaming: snookerScoring.streaming,
                  teamOneHandicap: snookerScoring.teamOneHandicap ?? 0,
                  teamTwoHandicap: snookerScoring.teamTwoHandicap ?? 0,
                  isRankingEvent: snookerScoring.isRankingEvent,
                  isStopClockEnabled: snookerScoring.isStopClockEnabled,
                  stopClockFrameTimeInSeconds: snookerScoring.stopClockFrameTimeInSeconds,
                  stopClockTurnTimeInSeconds: snookerScoring.stopClockTurnTimeInSeconds,
                  stopClockVoiceEnabled: snookerScoring.stopClockVoiceEnabled,
                }}
              />
              <SelectPlayerDrawer
                onSubmit={handlePlayerConfirmWithApi}
                setOpen={setOpenPlayerSelectCard}
                open={openPlayerSelectCard}
                playerIndex={selectedPlayerIndex}
                noOfPlayersPerTeam={snookerScoring.team1.players.length === 1 ? 1 : 2}
                teamIndex={selectedTeamIndex}
                clubId={clubs.activeClub ? clubs.activeClub.clubId : ''}
                disabledPlayerList={getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex(
                  snookerScoring.team1,
                  snookerScoring.team2,
                  selectedTeamIndex,
                  selectedPlayerIndex,
                )}
                showCancel={
                  snookerScoring.team1.players.every((p) => p.id !== null) &&
                  snookerScoring.team2.players.every((p) => p.id !== null)
                }
                showBack={!(selectedTeamIndex === 0 && selectedPlayerIndex === 0)}
                onBack={() => onBackInPlayerSelectModal()}
                teamPlayers={[...snookerScoring.team1.players, ...snookerScoring.team2.players]}
                onRemovePlayer={handleRemoveTeamPlayer}
                onClose={handlePlayerDrawerClose}
              />
              <PlayerOrderSelectModal
                isModalOpen={showPlayerOrderModal}
                activeTeamIndex={getActiveTeam(snookerScoring.team1, snookerScoring.team2)}
                onOrderConfirm={handlePlayerOrderSelect}
                teamOnePlayers={snookerScoring.team1.players}
                teamTwoPlayers={snookerScoring.team2.players}
                closeModal={() => setShowPlayerOrderModal(false)}
              />
              <SnookerMenuDrawer
                setOpen={(value) => setShowMenuDrawer(value)}
                open={showMenuDrawer}
                showCorrection={getActiveSet(snookerScoring.scoreHistory) !== undefined}
                showConcedeFrame={getActiveSet(snookerScoring.scoreHistory) !== undefined}
                showRerack={getActiveSet(snookerScoring.scoreHistory) !== undefined}
                onConcedeFrame={() => setShowConcedeFrameDrawer(true)}
                onEndGame={handleEndGame}
                onRerack={handleRerack}
                onCorrection={() => setShowCorrectionDrawer(true)}
                onEndFrame={handleEndFrameButton}
              />
              <SnookerScoreCorrectionDrawer
                setOpen={(value) => setShowCorrectionDrawer(value)}
                open={showCorrectionDrawer}
                onSubmit={handleCorrection}
                redsOnTable={numberOfRedsOnTable}
                teamOneScore={team1score}
                teamTwoScore={team2score}
                teamOne={snookerScoring.team1.players}
                teamTwo={snookerScoring.team2.players}
                maxReds={getNumberOfRedsFromFormat(snookerScoring.format)}
              />
              <SnookerScoreConcedeFrameDrawer
                setOpen={(value) => setShowConcedeFrameDrawer(value)}
                open={showConcedeFrameDrawer}
                onSubmit={handleConcedeFrameSelection}
                teamOne={snookerScoring.team1.players}
                teamTwo={snookerScoring.team2.players}
              />
              <TimerContinueModal
                isModalOpen={showTimerModal}
                onCancel={() => handleTimerButtonAction('CANCEL')}
                onContinue={() => handleTimerButtonAction('CONFIRM')}
              />
              <div className="flex gap-4 mt-4 mb-4 px-4 container pb-4">
                <Button onClick={() => setShowEndFrameAlert(true)} variant="secondary" className="flex-1">
                  End Frame
                </Button>
                <Button onClick={() => setShowEndGameAlert(true)} variant="destructive" className="flex-1">
                  End Match
                </Button>
              </div>
            </div>
          </div>

          <AlertDialog open={showCloseConfirmDialog} onOpenChange={setShowCloseConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you sure you want to close the game?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    if (closeConfirmSource.current === 'player') setOpenPlayerSelectCard(true);
                    else if (closeConfirmSource.current === 'settings') setOpenSettingsDrawer(true);
                    closeConfirmSource.current = null;
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleEndGame}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showEndFrameAlert} onOpenChange={setShowEndFrameAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Do you want to end this Frame?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEndFrameButton}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showEndGameAlert} onOpenChange={setShowEndGameAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Do you want to end this Match?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEndGame}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* ── Break-off player selection dialog ────────────────────── */}
          <Dialog
            open={showBreakOffDialog}
            onOpenChange={(open) => {
              if (!open) setShowBreakOffDialog(false);
            }}
          >
            <DialogContent className="max-w-sm w-[90vw] bg-[#1a1a1a] border-white/10 text-white">
              <BreakOffPlayerStep
                teams={[snookerScoring.team1, snookerScoring.team2].map((team, idx) => ({
                  photos: team.players.map((p, i) => p.profilePhoto ?? defaultImages[idx * 2 + i]),
                  label:
                    team.players
                      .map((p) => p.name)
                      .filter(Boolean)
                      .join(' / ') || `Team ${idx + 1}`,
                }))}
                selectedIdx={selectedBreakOffTeamIdx}
                onSelect={setSelectedBreakOffTeamIdx}
                onCancel={() => setShowBreakOffDialog(false)}
                onConfirm={handleBreakOffConfirm}
                confirmLabel="Confirm"
              />
            </DialogContent>
          </Dialog>
        </section>
      )}
    </section>
  );
}
