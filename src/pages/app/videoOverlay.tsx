import { TopOverlay } from '@/components/sections/stream/overlays/TopOverlay';
import { BBSLTemplate } from '@/components/sections/stream/templates/BBSL';
import { CatholicTemplate } from '@/components/sections/stream/templates/Catholic';
import { CatholicAprilTemplate } from '@/components/sections/stream/templates/CatholicApril';
import { CatholicSinglesTemplate } from '@/components/sections/stream/templates/CatholicSingles';
import { CenturyTemplate } from '@/components/sections/stream/templates/Century';
import { EcaTemplate } from '@/components/sections/stream/templates/Eca';
import { NewEca } from '@/components/sections/stream/templates/Eca-new';
import { GeneralTemplate } from '@/components/sections/stream/templates/General';
import { NewEcaTemplate } from '@/components/sections/stream/templates/NewEca';
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
    viewershipData,
    updateTime,
    streamingData,
  } = useStreaming(undefined, matchId ? matchId : undefined);

  useEffect(() => {
    const body = document.body;

    body.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('pointer-events', 'none', 'important');

    return () => {
      body.style.removeProperty('background-color');
      body.style.removeProperty('pointer-events');
    };
  }, []);

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
      {viewershipData &&
        (viewershipData.tournamentId ? (
          {
            '671f4acf089a3a701c79071f': (
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
            ),
            '679321b846b356ef640ca3d2': (
              <BBSLTemplate isTv={false} state={viewershipData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
            '679b307af7eaaf399004a914': (
              <BBSLTemplate isTv={false} state={viewershipData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
            '679ce81ed0202e686e8a96f6': (
              <CatholicTemplate isTv={false} state={viewershipData} activeTurn={activeTurn} activeSet={activeSet} />
            ),
            '67c68050f08592439d5c5a55': (
              <CatholicSinglesTemplate
                isTv={false}
                state={viewershipData}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            ),
            '67ee7037eb254339e7ee8857': (
              <NewEca
                state={viewershipData}
                isTv={false}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            ),
            '681a27430799a4ccbfb175fa': (
              <CatholicAprilTemplate
                isTv={false}
                state={viewershipData}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            ),
            '681a3e790799a4ccbfb17615': (
              <CenturyTemplate
                isTv={false}
                state={viewershipData}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            ),
            '68298983ffe9aacb1655b1f4': (
              <CenturyTemplate
                isTv={false}
                state={viewershipData}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            ),
            '681631fef773a447a1e34254': (
              <NewEcaTemplate
                isTv={false}
                state={viewershipData}
                activeTurn={activeTurn}
                activeSet={activeSet}
              />
            )
          }[viewershipData.tournamentId] || (
            <GeneralTemplate state={viewershipData} activeSet={activeSet} activeTurn={activeTurn} isTv={false} />
          )
        ) : (
          <GeneralTemplate state={viewershipData} activeSet={activeSet} activeTurn={activeTurn} isTv={false} />
        ))}
      {viewershipData && viewershipData.streams[0].overlayType === 'SOURCE_WITH_FINAL_SCORES' && <SourceWithFinalScores state={viewershipData} />}
    </div>
  );
}
