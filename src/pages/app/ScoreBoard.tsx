import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { ScoreBoardOrientationModal } from '@/components/modals/scoreBoardOrientationModal';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import { ScoreboardQrDisplay } from '@/components/sections/scoreboard/ScoreboardQrDisplay';
import useScoreboard from '@/hooks/useScoreboard';
import { useState } from 'react';
import NewScoreBoard from './NewScoreBoard';
import WelcomeScreen from './WelcomeScreen';

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
            <WelcomeScreen
              clubLogo={activeClub?.clubLogo ?? ''}
              clubName={activeClub?.clubName ?? ''}
              venue={activeClub?.venueNo}
            />
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
