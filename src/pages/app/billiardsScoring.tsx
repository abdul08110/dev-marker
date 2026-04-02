import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { SnookerMenuDrawer } from '@/components/modals/SnookerMenuDrawer';
import { BilliardsPracticeSettingsDrawer } from '@/components/modals/billiardsPracticeSettingsDrawer';
import { BilliardsBallSelectorModal } from '@/components/modals/billiardsSetColorModal';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { SelectPlayerDrawer } from '@/components/modals/selectPlayerDrawer';
import { TimerContinueModal } from '@/components/modals/timerContinueModal';
import { BilliardsScoringButtons } from '@/components/sections/scoring/billiardsScoringButton';
import { OnlineOfflineIndicator } from '@/components/sections/scoring/onlineOfflineIndicator';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import TimeManager from '@/components/sections/scoring/timeManager';
import { Button } from '@/components/ui/button';
import useBilliardsScoring from '@/hooks/useBilliardsScoring';
import { getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex } from '@/stores/selectors/commonSport';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
    showBallColorModal,
    handleBilliardsSelectColorBall,
    handleEndFrameButton,
    onBackInPlayerSelectModal,
    showTimerModal,
    handleTimerButtonAction,
  } = useBilliardsScoring();

  const [showEndFrameAlert, setShowEndFrameAlert] = React.useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = React.useState(false);

  // PARENT UI

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
              onSettingsClick={handleSettingsClick}
              showMenu={getActiveSet(billiardsScoring.scoreHistory) !== undefined || billiardsScoring.matchId !== null}
              showUndo={billiardsScoring.matchId !== null}
              onUndoClick={() => handleUndoButtonClick()}
            />
            <OnlineOfflineIndicator isOnline={isOnline} />
            <TimeManager timeLeft={timeLeft} size={'small'} />
            <PlayerTeamManager
              onPlayerButtonClick={handlePlayerSelect}
              activeTurnScore={activeTurnPointScore}
              activeTurnPointTypes={{
                teamOne: [],
                teamTwo: [],
              }}
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
              onButtonClick={handleScoringButtonClick}
              showBreakOff={getActiveSet(billiardsScoring.scoreHistory) === undefined}
              enableScoringButtons={getActiveTurn(getActiveSet(billiardsScoring.scoreHistory)) === null ? false : true}
            />

            <SelectPlayerDrawer
              onSubmit={handlePlayerConfirm}
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
            />

            <BilliardsPracticeSettingsDrawer
              open={openSettingsDrawer}
              setOpen={setOpenSettingsDrawer}
              onSubmit={handleSettingsUpdate}
            />
            <BilliardsBallSelectorModal
              isModalOpen={showBallColorModal}
              handleButtonUpdate={handleBilliardsSelectColorBall}
            />
            <TimerContinueModal
              isModalOpen={showTimerModal}
              onCancel={() => handleTimerButtonAction('CANCEL')}
              onContinue={() => handleTimerButtonAction('CONFIRM')}
            />
            <div className="flex gap-4 mt-4 mb-4 px-4">
              <Button onClick={() => setShowEndFrameAlert(true)} variant="secondary" className="flex-1">
                End Frame
              </Button>
              <Button onClick={() => setShowEndGameAlert(true)} variant="destructive" className="flex-1">
                End Match
              </Button>
            </div>
          </div>

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
        </section>
      )}
    </section>
  );
}
