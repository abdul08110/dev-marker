import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { SnookerMenuDrawer } from '@/components/modals/SnookerMenuDrawer';
import { BilliardsPracticeSettingsDrawer } from '@/components/modals/billiardsPracticeSettingsDrawer';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { SelectPlayerDrawer } from '@/components/modals/selectPlayerDrawer';
import { TimerContinueModal } from '@/components/modals/timerContinueModal';
import {
  BilliardsScoringButtons,
  BilliardsScoringButtonEnum,
} from '@/components/sections/scoring/billiardsScoringButton';
import { OnlineOfflineIndicator } from '@/components/sections/scoring/onlineOfflineIndicator';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import TimeManager from '@/components/sections/scoring/timeManager';
import { Button } from '@/components/ui/button';
import useBilliardsScoring from '@/hooks/useBilliardsScoring';
import {
  getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex,
  getActiveTeam,
} from '@/stores/selectors/commonSport';
import useSelectPlayer from '@/api/app/useSelectPlayer';
import { Player } from '@/stores/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import * as React from 'react';

export function BilliardsScoring() {
  const {
    billiardsScoring,
    clubs,
    timeLeft,
    openSettingsDrawer,
    openPlayerSelectCard,
    handleEndGame,
    handleBackClick,
    handleSettingsClick,
    handleScoringButtonClick,
    handlePlayerSelect,
    handlePlayerConfirm,
    handleSettingsUpdate,
    handleTeamClick,
    setOpenSettingsDrawer,
    setOpenPlayerSelectCard,
    selectedPlayerIndex,
    selectedTeamIndex,
    showLoadingModal,
    isOnline,
    team1score,
    team2score,
    showMenuDrawer,
    setShowMenuDrawer,
    getActiveSet,
    getActiveTurn,
    handleUndoButtonClick,
    activeTurnPointScore,
    loading,
    handleBilliardsSelectColorBall,
    handleEndFrameButton,
    onBackInPlayerSelectModal,
    handleRemoveTeamPlayer,
    showTimerModal,
    handleTimerButtonAction,
    handleGoToHome,
  } = useBilliardsScoring();

  const { selectPlayer } = useSelectPlayer();

  const handlePlayerConfirmWithApi = async (player: Player) => {
    const teamIdx = selectedTeamIndex;
    await handlePlayerConfirm(player);
    if (clubs.activeClub && player.id) {
      selectPlayer({ venueId: clubs.activeClub.venueId, playerNumber: teamIdx + 1, userId: player.id });
    }
  };

  // ── End frame / end game confirmation ────────────────────────────────────
  const [showEndFrameAlert, setShowEndFrameAlert] = React.useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = React.useState(false);

  // ── Player drawer close confirmation ─────────────────────────────────────
  const [showCloseConfirmDialog, setShowCloseConfirmDialog] = React.useState(false);
  const closeConfirmSource = React.useRef<'player' | 'settings' | null>(null);

  const handlePlayerDrawerClose = () => {
    const p1 = billiardsScoring.team1.players[0].id !== null;
    const p2 = billiardsScoring.team2.players[0].id !== null;
    if (p1 && p2) {
      // Both selected → auto-close after player 2 confirm, not a user gesture
      return;
    }
    if (p1) {
      closeConfirmSource.current = 'player';
      setShowCloseConfirmDialog(true);
      return;
    }
    handleGoToHome();
  };

  // ── No-player guard alert ────────────────────────────────────────────────
  const [showSelectPlayerAlert, setShowSelectPlayerAlert] = React.useState(false);

  // ── Settings drawer source tracking ──────────────────────────────────────
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

  const handleSettingsBack = () => {
    setOpenSettingsDrawer(false);
    setOpenPlayerSelectCard(true);
  };

  const handleSettingsDrawerClose = () => {
    if (billiardsScoring.matchId === null) {
      closeConfirmSource.current = 'settings';
      setShowCloseConfirmDialog(true);
    }
  };

  // Detect when the hook auto-transitions from player select → settings (after
  // player 2 confirmed). In that case the settings drawer needs a Back button.
  const prevOpenPlayerSelectRef = React.useRef(openPlayerSelectCard);
  React.useEffect(() => {
    if (openSettingsDrawer && prevOpenPlayerSelectRef.current) {
      setSettingsHasBack(true);
    }
    prevOpenPlayerSelectRef.current = openPlayerSelectCard;
  }, [openSettingsDrawer, openPlayerSelectCard]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Switch player ─────────────────────────────────────────────────────────
  const handleSwitchPlayer = () => {
    const active = getActiveTeam(billiardsScoring.team1, billiardsScoring.team2);
    handleTeamClick(active === 0 ? 1 : 0);
  };

  // ── Break-off multi-step dialog ──────────────────────────────────────────
  const [breakOffStep, setBreakOffStep] = React.useState<null | 'player' | 'ball'>(null);
  const [selectedBreakOffTeamIdx, setSelectedBreakOffTeamIdx] = React.useState<number | null>(null);
  const [selectedBall, setSelectedBall] = React.useState<'white' | 'yellow' | null>(null);

  const handleScoringButtonClickWithGuard = (buttonType: BilliardsScoringButtonEnum) => {
    if (
      buttonType === BilliardsScoringButtonEnum.BREAK_OFF &&
      (billiardsScoring.team1.players[0].id === null || billiardsScoring.team2.players[0].id === null)
    ) {
      setShowSelectPlayerAlert(true);
      return;
    }
    if (
      buttonType === BilliardsScoringButtonEnum.BREAK_OFF &&
      billiardsScoring.scoreHistory.length === 0 &&
      getActiveTeam(billiardsScoring.team1, billiardsScoring.team2) === null
    ) {
      setSelectedBreakOffTeamIdx(null);
      setSelectedBall(null);
      setBreakOffStep('player');
      return;
    }
    handleScoringButtonClick(buttonType);
  };

  const handleBreakOffPlayerNext = async () => {
    if (selectedBreakOffTeamIdx === null) return;
    await handleTeamClick(selectedBreakOffTeamIdx);
    setSelectedBall(null);
    setBreakOffStep('ball');
  };

  const handleBreakOffBallConfirm = async () => {
    if (selectedBall === null) return;
    await handleBilliardsSelectColorBall(selectedBall);
    setBreakOffStep(null);
    setSelectedBreakOffTeamIdx(null);
    setSelectedBall(null);
  };

  const handleBreakOffCancel = () => {
    setBreakOffStep(null);
    setSelectedBreakOffTeamIdx(null);
    setSelectedBall(null);
  };

  // ── Team label helpers ────────────────────────────────────────────────────
  const team1Label = billiardsScoring.team1.players[0].name ?? 'Player 1';
  const team2Label = billiardsScoring.team2.players[0].name ?? 'Player 2';

  return (
    <section>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          <SnookerMenuDrawer
            setOpen={(value) => setShowMenuDrawer(value)}
            open={showMenuDrawer}
            showCorrection={getActiveSet(billiardsScoring.scoreHistory) !== undefined}
            showConcedeFrame={getActiveSet(billiardsScoring.scoreHistory) !== undefined}
            showRerack={getActiveSet(billiardsScoring.scoreHistory) !== undefined}
            showEndGame={true}
            showEndFrame={true}
            onConcedeFrame={() => {}}
            onEndGame={handleEndGame}
            onRerack={() => {}}
            onCorrection={() => {}}
            onEndFrame={handleEndFrameButton}
          />
          <ScoreUpdateLoadingModal isModalOpen={showLoadingModal} />
          <div className="flex flex-col pb-8 gap-4 justify-start h-screen overflow-y-scroll">
            <ScoringHeader
              onBackClick={handleBackClick}
              onMenuClick={() => setShowMenuDrawer(true)}
              onSettingsClick={handleSettingsClickIntercepted}
              showMenu={getActiveSet(billiardsScoring.scoreHistory) !== undefined || billiardsScoring.matchId !== null}
              showUndo={billiardsScoring.matchId !== null}
              onUndoClick={() => handleUndoButtonClick()}
            />
            <OnlineOfflineIndicator isOnline={isOnline} />
            <TimeManager timeLeft={timeLeft} size={'small'} />
            <PlayerTeamManager
              onPlayerButtonClick={handlePlayerSelect}
              activeTurnScore={activeTurnPointScore}
              activeTurnPointTypes={{ teamOne: [], teamTwo: [] }}
              team1SetScore={team1score}
              team2SetScore={team2score}
              onTeamClick={handleTeamClick}
              team1={billiardsScoring.team1}
              team2={billiardsScoring.team2}
              matchId={billiardsScoring.matchId}
              showBilliardsButtons={true}
            />
            <SnookerFramesSummary
              team1Handicap={billiardsScoring.teamOneHandicap != null ? billiardsScoring.teamOneHandicap : undefined}
              team2Handicap={billiardsScoring.teamTwoHandicap != null ? billiardsScoring.teamTwoHandicap : undefined}
              team1Score={billiardsScoring.tournamentId ? undefined : billiardsScoring.team1Score}
              team2Score={billiardsScoring.tournamentId ? undefined : billiardsScoring.team2Score}
            />
            <BilliardsScoringButtons
              onButtonClick={handleScoringButtonClickWithGuard}
              showBreakOff={getActiveSet(billiardsScoring.scoreHistory) === undefined}
              enableScoringButtons={getActiveTurn(getActiveSet(billiardsScoring.scoreHistory)) === null ? false : true}
              handleSwitchPlayer={handleSwitchPlayer}
              enableSwitchPlayer={getActiveSet(billiardsScoring.scoreHistory) !== undefined}
            />

            <SelectPlayerDrawer
              onSubmit={handlePlayerConfirmWithApi}
              setOpen={setOpenPlayerSelectCard}
              open={openPlayerSelectCard}
              playerIndex={selectedPlayerIndex}
              noOfPlayersPerTeam={billiardsScoring.team1.players.length === 1 ? 1 : 2}
              teamIndex={selectedTeamIndex}
              clubId={clubs.activeClub ? clubs.activeClub.clubId : ''}
              disabledPlayerList={getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex(
                billiardsScoring.team1,
                billiardsScoring.team2,
                selectedTeamIndex,
                selectedPlayerIndex,
              )}
              showCancel={
                billiardsScoring.team1.players[0].id !== null && billiardsScoring.team2.players[0].id !== null
              }
              showBack={billiardsScoring.team1.players[0].id !== null && billiardsScoring.team2.players[0].id === null}
              onBack={() => onBackInPlayerSelectModal()}
              teamPlayers={[...billiardsScoring.team1.players, ...billiardsScoring.team2.players]}
              onRemovePlayer={handleRemoveTeamPlayer}
              onClose={handlePlayerDrawerClose}
            />

            <BilliardsPracticeSettingsDrawer
              open={openSettingsDrawer}
              setOpen={setOpenSettingsDrawer}
              onSubmit={handleSettingsUpdate}
              teamOneLabel={team1Label}
              teamTwoLabel={team2Label}
              showBack={settingsHasBack}
              onBack={handleSettingsBack}
              onClose={handleSettingsDrawerClose}
            />
            <TimerContinueModal
              isModalOpen={showTimerModal}
              onCancel={() => handleTimerButtonAction('CANCEL')}
              onContinue={() => handleTimerButtonAction('CONFIRM')}
            />
            <div className="flex gap-2 mt-4 mb-4 px-4">
              <Button onClick={() => setShowEndFrameAlert(true)} variant="secondary" className="flex-1">
                End Frame
              </Button>
              <Button onClick={() => setShowEndGameAlert(true)} variant="destructive" className="flex-1">
                End Match
              </Button>
            </div>
          </div>

          {/* ── Close confirmation dialog ───────────────────────────────── */}
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

          {/* ── No player selected alert ────────────────────────────────── */}
          <AlertDialog open={showSelectPlayerAlert} onOpenChange={setShowSelectPlayerAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Players not selected</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowSelectPlayerAlert(false);
                    handlePlayerSelect(0, billiardsScoring.team1.players[0].id === null ? 0 : 1);
                  }}
                >
                  Select Player
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* ── Break-off multi-step dialog ─────────────────────────────── */}
          <Dialog
            open={breakOffStep !== null}
            onOpenChange={(open) => {
              if (!open) handleBreakOffCancel();
            }}
          >
            <DialogContent className="max-w-sm w-[90vw] bg-[#1a1a1a] border-white/10 text-white">
              <DialogTitle className="text-lg font-semibold text-white">
                {breakOffStep === 'player' ? 'Who is breaking off?' : 'Select your ball'}
              </DialogTitle>

              {breakOffStep === 'player' && (
                <>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { idx: 0, player: billiardsScoring.team1.players[0] },
                      { idx: 1, player: billiardsScoring.team2.players[0] },
                    ].map(({ idx, player }) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedBreakOffTeamIdx(idx)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                          selectedBreakOffTeamIdx === idx ? 'border-white bg-white/10' : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <img
                          src={player.profilePhoto ?? '/images/user-dummy-pic.jpg'}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-center leading-tight">
                          {player.name ?? `Player ${idx + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="secondary" className="flex-1" onClick={handleBreakOffCancel}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={selectedBreakOffTeamIdx === null}
                      onClick={handleBreakOffPlayerNext}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}

              {breakOffStep === 'ball' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {(['white', 'yellow'] as const).map((ball) => (
                      <button
                        key={ball}
                        onClick={() => setSelectedBall(ball)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                          selectedBall === ball ? 'border-white bg-white/10' : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <img src={`/images/${ball}-ball.png`} className="h-14 w-14 object-contain" />
                        <span className="text-sm font-medium uppercase">{ball}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setBreakOffStep('player')}>
                      Back
                    </Button>
                    <Button className="flex-1" disabled={selectedBall === null} onClick={handleBreakOffBallConfirm}>
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* ── End frame confirmation ──────────────────────────────────── */}
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

          {/* ── End game confirmation ───────────────────────────────────── */}
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
        </section>
      )}
    </section>
  );
}
