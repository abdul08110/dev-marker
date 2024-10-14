import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { SnookerMenuDrawer } from '@/components/modals/SnookerMenuDrawer';
import { BilliardsPracticeSettingsDrawer } from '@/components/modals/billiardsPracticeSettingsDrawer';
import { BilliardsBallSelectorModal } from '@/components/modals/billiardsSetColorModal';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { SelectPlayerDrawer } from '@/components/modals/selectPlayerDrawer';
import { BilliardsScoringButtons } from '@/components/sections/scoring/billiardsScoringButton';
import { OnlineOfflineIndicator } from '@/components/sections/scoring/onlineOfflineIndicator';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import TimeManager from '@/components/sections/scoring/timeManager';
import useBilliardsScoring from '@/hooks/useBilliardsScoring';
import { getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex } from '@/stores/selectors/commonSport';

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
    handleEndFrameButton
  } = useBilliardsScoring();

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
            showCorrection={false}
            showConcedeFrame={false}
            showRerack={false}
            showEndGame={true}
            showEndFrame={billiardsScoring.noOfSets !== null && billiardsScoring.noOfSets > 1}
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
              activeTurnPointTypes={null}
              team1SetScore={team1score}
              team2SetScore={team2score}
              onTeamClick={handleTeamClick}
              team1={billiardsScoring.team1}
              team2={billiardsScoring.team2}
              matchId={billiardsScoring.matchId}
              showBilliardsButtons={true}
            />
            <SnookerFramesSummary team1Score={billiardsScoring.team1Score} team2Score={billiardsScoring.team2Score} />
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
          </div>
        </section>
      )}
    </section>
  );
}
