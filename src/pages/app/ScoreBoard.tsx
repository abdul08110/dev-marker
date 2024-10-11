import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import TimeManager from '@/components/sections/scoring/timeManager';
import useScoreboard from '@/hooks/useScoreboard';

export function ScoreBoard() {
  const { loading, scoreBoardData, timeLeft, orientation } = useScoreboard();

  return (
    <section>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          {scoreBoardData ? (
            <section className="h-screen w-screen flex flex-col py-10 gap-4">
              <TimeManager timeLeft={timeLeft} size={'large'} />
              <ScoreboardRender state={scoreBoardData} orientation={orientation} />
            </section>
          ) : (
            <section className="h-screen w-screen flex justify-center items-center">
              <div className="text-white">
                <h3 className="text-center">Waiting for Match to Start</h3>
              </div>
            </section>
          )}
        </section>
      )}
    </section>
  );
}
