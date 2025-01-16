import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { LandscapeScoreboard } from '@/components/sections/scoreboard/landScapeScoreBoard';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import useScoreboardRender from '@/hooks/useScoreboardRender';

export function ScoreBoardRender() {
  const { loading, scoreBoardData, timeLeft, orientation, showTimeOverAlert } = useScoreboardRender();

  return (
    <section className='cursor-none'>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          {scoreBoardData ? (
            orientation === 'portrait' ? (
              <ScoreboardRender timeLeft={timeLeft} state={scoreBoardData} orientation={orientation} />
            ) : (
              <LandscapeScoreboard timeLeft={timeLeft} state={scoreBoardData} />
            )
          ) : (
            <section className="h-screen w-screen flex justify-center items-center">
              <div className="text-white">
                <h3 className="text-center">Waiting for Match to Start</h3>
              </div>
            </section>
          )}
        </section>
      )}

      <TimeUpModal isModalOpen={showTimeOverAlert} rotate={orientation === 'portrait'} />
    </section>
  );
}
