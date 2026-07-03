import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { ScoreBoardOrientationModal } from '@/components/modals/scoreBoardOrientationModal';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import { ScoreboardQrDisplay } from '@/components/sections/scoreboard/ScoreboardQrDisplay';
import useScoreboard from '@/hooks/useScoreboard';
import { useState } from 'react';
import NewScoreBoard from './NewScoreBoard';

export function ScoreBoard() {
  const { loading, scoreBoardData, timeLeft, orientation, setOrientation, showTimeOverAlert, activeClub, qrFlowState } =
    useScoreboard();
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
              // <LegacyScoreboard timeLeft={timeLeft} state={scoreBoardData} />
              <NewScoreBoard timeLeft={timeLeft} state={scoreBoardData} />
            )
          ) : qrFlowState.isActive ? (
            <ScoreboardQrDisplay qrFlowState={qrFlowState} activeClub={activeClub} />
          ) : (
            <section className="h-screen w-screen flex justify-center items-center">
              <div className="text-white flex flex-col items-center gap-4">
                {activeClub?.clubLogo && (
                  <img src={activeClub.clubLogo} alt="Club Logo" className="h-24 w-24 object-cover rounded-full overflow-hidden" />
                )}
                <h3 className="text-center text-2xl font-bold">Welcome to {activeClub?.clubName}</h3>
                {activeClub?.venueNo && <h4 className="text-center text-xl">TABLE-{activeClub.venueNo}</h4>}
              </div>
            </section>
          )}
        </section>
      )}

      <ScoreBoardOrientationModal
        isModalOpen={showScoreBoardOrientationModal && !!scoreBoardData}
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
