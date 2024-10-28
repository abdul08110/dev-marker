import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import { Button } from '@/components/ui/button';
import useScoreboard from '@/hooks/useScoreboard';
import OrientationLogo from '@/icons/orientation';

export function ScoreBoard() {
  const { loading, scoreBoardData, timeLeft, orientation, setOrientation } = useScoreboard();

  return (
    <section>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          {scoreBoardData ? (
            <section className="h-screen w-screen flex flex-col py-4 gap-4 relative">
              <div className="flex justify-between container">
                <Button onClick={() => setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape')}>
                  <OrientationLogo className="h-5 w-5 text-white" />
                </Button>
              </div>
              <ScoreboardRender timeLeft={timeLeft} state={scoreBoardData} orientation={orientation} />
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
