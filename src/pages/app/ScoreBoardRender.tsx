import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { TimeUpModal } from '@/components/modals/timeUpModal';
import { ScoreboardRender } from '@/components/sections/scoreboard/scoreBoardRender';
import { ScoreboardQrDisplay } from '@/components/sections/scoreboard/ScoreboardQrDisplay';
import useScoreboardRender from '@/hooks/useScoreboardRender';
import NewScoreBoard from './NewScoreBoard';

export function ScoreBoardRender() {
  const { loading, scoreBoardData, timeLeft, orientation, showTimeOverAlert, clubInfo, qrFlowState, activeClub } =
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
              <section className="h-screen w-screen flex justify-center items-center">
              <div className="text-white flex flex-col items-center gap-4">
                {clubInfo?.clubPhoto && (
                  <img src={clubInfo.clubPhoto} alt="Club Logo" className="h-24 w-24 object-contain" />
                )}
                {clubInfo?.clubName && <h3 className="text-center text-2xl font-bold">Welcome to {clubInfo.clubName}</h3>}
              </div>
            </section>
          )}
        </section>
      )}

      <TimeUpModal isModalOpen={showTimeOverAlert} rotate={orientation === 'portrait'} />
    </section>
  );
}
