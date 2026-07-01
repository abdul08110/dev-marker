import { TopOverlay } from '@/components/sections/stream/overlays/TopOverlay';
import { BBSLTemplate } from '@/components/sections/stream/templates/BBSL';
import { CatholicTemplate } from '@/components/sections/stream/templates/Catholic';
import { CatholicJune } from '@/components/sections/stream/templates/CatholicJune';
import { CenturyTemplate } from '@/components/sections/stream/templates/Century';
import { EcaTemplate } from '@/components/sections/stream/templates/Eca';
import { NewEcaTemplate } from '@/components/sections/stream/templates/NewEca';
import { SourceWithFinalScores } from '@/components/sections/stream/templates/SourceFinalScores';
import { Singles } from '@/components/sections/stream/templates/Singles';
import { IGTemplate } from '@/components/sections/stream/templates/IG';
import useLiveScoring from '@/hooks/useLiveScoring';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { useEffect, useState } from 'react';
import NewGeneral from '@/components/sections/stream/templates/NewGeneral';

export function LiveScoring() {
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchid');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }
  }, []);

  const { loading: streamingLoading, streamingData } = useLiveScoring(matchId ? matchId : '');

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
        showIGLogo={streamingData.tournamentId === '6938036004eb9abe7e2c3d04'}
        showOtherLogos={
          streamingData.tournamentId !== null &&
          streamingData.tournamentId !== undefined &&
          (streamingData.tournamentId === '686a26d5b2e48cf0cc86a61b' ||
            streamingData.tournamentId === '69142512da7d00af591b5657' ||
            streamingData.tournamentId === '698d368d51dc1ec36260dc30')
        }
      />
      {streamingData.tournamentId ? (
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
          '681a3e790799a4ccbfb17615': (
            <CenturyTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68298983ffe9aacb1655b1f4': (
            <CenturyTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '681631fef773a447a1e34254': (
            <NewEcaTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68496e3c945ee0fb4985fca4': (
            <CatholicJune isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '6818b4cef773a447a1e34373': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '6874b2bc4c0c210729491427': (
            <Singles isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68ac0599c8a52eb65477c05f': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68bef0791d2f4e355bb2e810': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '680893386bd1fa17a8462687': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68e0f18ea2835272fa7ce4d7': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
          '68e73ba3152c8e26d7bc78a9': (
            <IGTemplate isTv={false} state={streamingData} activeTurn={activeTurn} activeSet={activeSet} />
          ),
        }[streamingData.tournamentId] || (
          <IGTemplate state={streamingData} activeSet={activeSet} activeTurn={activeTurn} isTv={false} />
        )
      ) : (
        // <GeneralTemplate state={streamingData} activeSet={activeSet} activeTurn={activeTurn} isTv={false} />
        <NewGeneral state={streamingData} activeSet={activeSet} activeTurn={activeTurn} isTv={false} />
      )}
      {streamingData.overlayType === 'SOURCE_WITH_FINAL_SCORES' && <SourceWithFinalScores state={streamingData} />}
    </div>
  );
}
