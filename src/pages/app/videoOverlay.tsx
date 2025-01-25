import { TopOverlay } from '@/components/sections/stream/overlays/TopOverlay';
import { EcaTemplate } from '@/components/sections/stream/templates/Eca';
import { GeneralTemplate } from '@/components/sections/stream/templates/General';
import { SourceWithFinalScores } from '@/components/sections/stream/templates/SourceFinalScores';
import useStreaming from '@/hooks/useStreaming';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { useEffect, useState } from 'react';

export function VideoOverlay() {
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }
  }, []);

  const {
    loading: streamingLoading,
    timeLeft,
    viewershipData,
    updateTime,
    streamingData,
  } = useStreaming(undefined, matchId ? matchId : undefined);

  useEffect(() => {
    (window as any).onTimerUpdate = (timeInMilliseconds: number) => {
      updateTime(timeInMilliseconds);
    };

    return () => {
      delete (window as any).onTimerUpdate;
    };
  }, [updateTime]);

  if (streamingLoading || viewershipData === null || streamingData === null) {
    return <></>;
  }

  const activeSet = getActiveSet(viewershipData ? viewershipData.sets : []);
  const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="h-screen w-screen bg-transparent pointer-events-none">
      <TopOverlay
        clubLogo={viewershipData!.clubLogo!}
        tournamentLogo={viewershipData.tournamentLogo}
        venueNo={viewershipData.venueNo!}
      />
      {streamingData.overlayType !== 'SOURCE_WITH_FINAL_SCORES' ? (
        viewershipData.tournamentId === '671f4acf089a3a701c79071f' ? (
          <EcaTemplate
            teamOneLogo={viewershipData.teamOneLogo}
            teamTwoLogo={viewershipData.teamTwoLogo}
            activePlayerId={viewershipData.activePlayerId}
            activeTurn={activeTurn}
            tournamentName={viewershipData.tournamentName!}
            sideOnePlayerOne={viewershipData.sideOnePlayerOne}
            sideTwoPlayerOne={viewershipData.sideTwoPlayerOne}
            isTeamOneHandicapApplied={viewershipData.isTeamOneHandicapApplied!}
            isTeamTwoHandicapApplied={viewershipData.isTeamTwoHandicapApplied!}
            teamOneHandicap={viewershipData.teamOneHandicap!}
            teamTwoHandicap={viewershipData.teamTwoHandicap!}
            maxScorePerSet={viewershipData.maxScorePerSet!}
            teamOneScore={viewershipData.teamOneScore}
            teamTwoScore={viewershipData.teamTwoScore}
          />
        ) : (
          <GeneralTemplate state={viewershipData} activeSet={activeSet} activeTurn={activeTurn} timeLeft={timeLeft} />
        )
      ) : (
        <SourceWithFinalScores state={streamingData!} />
      )}
    </div>
  );
}
