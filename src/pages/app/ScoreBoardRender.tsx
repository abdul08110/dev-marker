import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import { ScoreboardQrDisplay } from '@/components/sections/scoreboard/ScoreboardQrDisplay';
import useScoreboardRender from '@/hooks/useScoreboardRender';
import NewScoreBoard from './NewScoreBoard';
import WelcomeScreen from './WelcomeScreen';

export function ScoreBoardRender() {
  const { loading, scoreBoardData, timeLeft, orientation, showTimeOverAlert, qrFlowState, activeClub } =
    useScoreboardRender();

  return (
    <section className="cursor-none">
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          {scoreBoardData ? (
            orientation === 'portrait' ? (
              <ScoreboardRender timeLeft={timeLeft} state={scoreBoardData} orientation={orientation} />
            ) : (
              // <LegacyScoreboard timeLeft={timeLeft} state={scoreBoardData} />
              <NewScoreBoard timeLeft={timeLeft} state={scoreBoardData} />
            )
          ) : qrFlowState.isActive ? (
            <ScoreboardQrDisplay qrFlowState={qrFlowState} activeClub={activeClub} />
          ) : (
            <WelcomeScreen
              clubLogo={activeClub?.clubLogo ?? ''}
              clubName={activeClub?.clubName ?? ''}
              venue={activeClub?.venueNo}
            />
          )}
        </section>
      )}

      <TimeUpModal isModalOpen={showTimeOverAlert} rotate={orientation === 'portrait'} />
    </section>
  );
}
