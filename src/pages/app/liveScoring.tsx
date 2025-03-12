import { TopOverlay } from '@/components/sections/stream/overlays/TopOverlay';
import { BBSLTemplate } from '@/components/sections/stream/templates/BBSL';
import { CatholicTemplate } from '@/components/sections/stream/templates/Catholic';
import { EcaTemplate } from '@/components/sections/stream/templates/Eca';
import { GeneralTemplate } from '@/components/sections/stream/templates/General';
import { SourceWithFinalScores } from '@/components/sections/stream/templates/SourceFinalScores';
import useLiveScoring from '@/hooks/useLiveScoring';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { useEffect, useState } from 'react';

export function LiveScoring() {
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }
  }, []);

  const { loading: streamingLoading, timeLeft, streamingData } = useLiveScoring(matchId ? matchId : '');

  useEffect(() => {
    const body = document.body;

    body.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('pointer-events', 'none', 'important');

    return () => {
      body.style.removeProperty('background-color');
      body.style.removeProperty('pointer-events');
    };
  }, []);

  if (streamingLoading || streamingData === null) {
    return <></>;
  }

  const activeSet = getActiveSet(streamingData ? streamingData.sets : []);
  const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="h-screen w-screen bg-transparent pointer-events-none">
      <TopOverlay
        clubLogo={streamingData!.clubLogo!}
        tournamentLogo={streamingData.tournamentLogo}
        venueNo={streamingData.venueNo!}
      />
      {streamingData.overlayType === 'DESTINATION' &&
        (streamingData.tournamentId ? (
          {
            '671f4acf089a3a701c79071f': (
              <EcaTemplate
                teamOneLogo={streamingData.teamOneLogo}
                teamTwoLogo={streamingData.teamTwoLogo}
                activePlayerId={streamingData.activePlayerId}
                activeTurn={activeTurn}
                tournamentName={streamingData.tournamentName!}
                sideOnePlayerOne={streamingData.sideOnePlayerOne}
                sideTwoPlayerOne={streamingData.sideTwoPlayerOne}
                isTeamOneHandicapApplied={streamingData.isTeamOneHandicapApplied!}
                isTeamTwoHandicapApplied={streamingData.isTeamTwoHandicapApplied!}
                teamOneHandicap={streamingData.teamOneHandicap!}
                teamTwoHandicap={streamingData.teamTwoHandicap!}
                maxScorePerSet={streamingData.maxScorePerSet!}
                teamOneScore={streamingData.teamOneScore}
                teamTwoScore={streamingData.teamTwoScore}
              />
            ),
            '679321b846b356ef640ca3d2': (
              <BBSLTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
            '679b307af7eaaf399004a914': (
              <BBSLTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
            '679ce81ed0202e686e8a96f6': (
              <CatholicTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
          }[streamingData.tournamentId] || (
            <GeneralTemplate state={streamingData} activeSet={activeSet} activeTurn={activeTurn} timeLeft={timeLeft} />
          )
        ) : (
          <GeneralTemplate state={streamingData} activeSet={activeSet} activeTurn={activeTurn} timeLeft={timeLeft} />
        ))}
      {streamingData.overlayType === 'SOURCE_WITH_FINAL_SCORES' && <SourceWithFinalScores state={streamingData} />}
    </div>
  );
}
