import { MarkerNavigation } from '@/components/sections/scoring/markerNavigation';
import { MaxScore } from '@/components/sections/scoring/maxScore';
import { PlayerTeamManager } from '@/components/sections/scoring/playerTeamManager';
import { ScoringHeader } from '@/components/sections/scoring/scoringHeader';
import { SnookerScoringButtons } from '@/components/sections/scoring/snookerScoringButtons';
import TimeManager from '@/components/sections/scoring/timeManager';
import { SnookerFoulDrawer } from '@/components/modals/snookerFoulDrawer';
import { SnookerFramesSummary } from '@/components/sections/scoring/snookerFrameSummary';
import { SnookerPracticeSettingsDrawer } from '@/components/modals/snookerPracticeSettingsDrawer';
import {
  getActivePlayer,
  getActiveSet,
  getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex,
} from '@/stores/selectors/commonSport';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { TextHeader } from '@/components/sections/scoring/textHeader';
import { Statistics } from '@/components/sections/scoring/statistics';
import { Breaks } from '@/components/sections/scoring/breaks';
import { EndGameModal } from '@/components/modals/endGameModal';
import { SelectPlayerDrawer } from '@/components/modals/selectPlayerDrawer';
import useSnookerScoring from '@/hooks/useSnookerScoring';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { OnlineOfflineIndicator } from '@/components/sections/scoring/onlineOfflineIndicator';
import { PlayerOrderSelectModal } from '@/components/modals/playerOrderSelectModal';

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
    getActiveTeam
  } = useSnookerScoring();

  // PARENT UI
  return (
    <section>
      <EndGameModal
        isModalOpen={showEndGameModal}
        confirmModal={() => handleGoToHome()}
        closeModal={() => setShowEndGameModal(false)}
      />
      <ScoreUpdateLoadingModal isModalOpen={showLoadingModal} />
      <Tabs defaultValue="scoring" className="flex flex-col justify-start h-screen overflow-y-scroll">
        <TabsContent value="scoring" className="flex-grow mt-0">
          <div className="flex flex-col gap-6 h-full">
            <ScoringHeader onBackClick={handleBackClick} onSettingsClick={handleSettingsClick} />
            <OnlineOfflineIndicator isOnline={isOnline} />
            <TimeManager timeLeft={timeLeft} />
            <PlayerTeamManager
              onPlayerButtonClick={handlePlayerSelect}
              activeTurnScore={activeTurnPointScore}
              activeTurnPointTypes={activeTurnPointTypes}
              team1SetScore={team1score}
              team2SetScore={team2score}
              onTeamClick={handleTeamClick}
              team1={snookerScoring.team1}
              team2={snookerScoring.team2}
              matchId={snookerScoring.matchId}
            />
            <SnookerFramesSummary team1Score={snookerScoring.team1Score} team2Score={snookerScoring.team2Score} />
            <MaxScore numberAhead={snookerScoring.numberAhead} numberOn={snookerScoring.numberOn} />
            <SnookerScoringButtons
              isLongEnabled={isLongActive}
              onLongClick={() => setIsLongActive(!isLongActive)}
              isBreakOff={!getActiveSet(snookerScoring.scoreHistory)}
              disabledState={snookerButtonDisabledState}
              onButtonClick={handleScoringButtonClick}
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
            />
            <SelectPlayerDrawer
              onSubmit={handlePlayerConfirm}
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
            />
            <PlayerOrderSelectModal
              isModalOpen={showPlayerOrderModal}
              activeTeamIndex={getActiveTeam(snookerScoring.team1, snookerScoring.team2)}
              onOrderConfirm={handlePlayerOrderSelect}
              teamOnePlayers={snookerScoring.team1.players}
              teamTwoPlayers={snookerScoring.team2.players}
              closeModal={() => { setShowPlayerOrderModal(false) }}
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
