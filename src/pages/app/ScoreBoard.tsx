import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { ScoreBoardOrientationModal } from '@/components/modals/scoreBoardOrientationModal';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { LegacyScoreboard } from '@/components/sections/scoreboard/legacyScoreBoard';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import useScoreboard from '@/hooks/useScoreboard';
import { useState } from 'react';

export function ScoreBoard() {
  const { loading, scoreBoardData, timeLeft, orientation, setOrientation, showTimeOverAlert } = useScoreboard();
  const [showScoreBoardOrientationModal, setShowScoreBoardOrientationModal] = useState(true);

  return (
    <section>
      {loading ? (
        <SnookerMarkingLoading />
      ) : (
        <section>
          {scoreBoardData ? (
            orientation === 'portrait' ? (
              <ScoreboardRender timeLeft={timeLeft} state={scoreBoardData} orientation={orientation} />
            ) : (
              <LegacyScoreboard timeLeft={timeLeft} state={scoreBoardData} />
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

      <ScoreBoardOrientationModal
        isModalOpen={showScoreBoardOrientationModal}
        closeModal={() => setShowScoreBoardOrientationModal(false)}
        confirmModal={() => {
          setOrientation('portrait');
          setShowScoreBoardOrientationModal(false);
        }}
      />

      <TimeUpModal isModalOpen={showTimeOverAlert} rotate={orientation === 'portrait'} />
    </section>
  );
}
