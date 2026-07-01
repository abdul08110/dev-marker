import { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { formatTimeMatchTime } from '@/utils/functions';

const TEAM_ONE = {
  name: 'Cosmopolitan Club',
  logo: '/images/test/cosmopolitan-club.png',
};

const TEAM_TWO = {
  name: 'Maleshwaram - A',
  logo: '/images/test/century-club.png',
};

interface SinglesMatch {
  label: string;
  doubles?: false;
  playerOne: string;
  playerTwo: string;
}

interface DoublesMatch {
  label: string;
  doubles: true;
  playerOneTop: string;
  playerOneBottom: string;
  playerTwoTop: string;
  playerTwoBottom: string;
}

type MatchRowData = SinglesMatch | DoublesMatch;

const MATCHES: MatchRowData[] = [
  { label: '6 Red Singles', playerOne: 'Shardu Malpani', playerTwo: 'Naresh Chowhan' },
  { label: '6 Red Singles', playerOne: 'Bharath Chugh', playerTwo: 'Arjun Mehta' },
  {
    label: '6 Red Singles',
    doubles: true,
    playerOneTop: 'DR Rajeev',
    playerOneBottom: 'Sharan',
    playerTwoTop: 'DR Rajeev',
    playerTwoBottom: 'Sharan',
  },
  { label: '6 Red Singles', playerOne: 'Sujith Mathew', playerTwo: 'Sri Hari' },
];

const PANEL_GRADIENT = 'radial-gradient(circle, rgba(71,43,108,0.5) 0%, rgba(47,31,79,0.75) 34%, rgba(24,19,50,1) 68%)';

const TestScreen = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] bg-no-repeat flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(3vh,3vw)] py-[min(1.1vh,1.1vw)] w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-[min(10vh,10vw)]"
            fallback="/images/user-dummy-pic.jpg"
            src={TEAM_ONE.logo}
          />
          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {TEAM_ONE.name}
          </p>
        </div>

        <ImageWithFallback
          className="justify-self-center w-[min(37vh,37vw)] h-auto"
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />

        <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          match time {formatTimeMatchTime(elapsed)}
        </p>
      </div>

      {/* Bracket */}
      <div className="flex-1 flex flex-col justify-center gap-[min(2.59vh,2.59vw)] overflow-hidden">
        <div className="flex items-stretch h-[min(7.41vh,7.41vw)] border border-white/[0.12] overflow-hidden shrink-0">
          <div className="flex-1 flex items-center bg-[#AB51C6] border border-[#E3A9F2] rounded-l-[6px] px-[min(1.3vh,1.3vw)] min-w-0">
            <p className="font-bold text-[min(4.63vh,4.63vw)] leading-[130%] text-white text-box-trim uppercase truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
              {TEAM_ONE.name}
            </p>
          </div>
          <div
            className="shrink-0 flex items-center justify-center border border-[#E39CF5] px-[min(3.7vh,3.7vw)] py-[min(1.48vh,1.48vw)]"
            style={{ backgroundImage: PANEL_GRADIENT }}
          >
            <p className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase">
              vs
            </p>
          </div>
          <div className="flex-1 flex items-center justify-end bg-[#AB51C6] border border-[#E3A9F2] rounded-r-[6px] px-[min(1.3vh,1.3vw)] min-w-0">
            <p className="font-bold text-[min(4.63vh,4.63vw)] leading-[130%] text-white text-box-trim uppercase truncate text-right drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
              {TEAM_TWO.name}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between min-h-0">
          <div className="shrink-0 size-[min(23.89vh,23.89vw)]">
            <img src={TEAM_ONE.logo} alt={TEAM_ONE.name} className="size-full object-cover rounded-full" />
          </div>

          <div className="flex flex-col gap-[min(2.96vh,2.96vw)] w-[min(105.37vh,105.37vw)] shrink-0">
            {MATCHES.map((match, i) => (
              <MatchRow key={i} match={match} />
            ))}
          </div>

          <div className="shrink-0 size-[min(23.89vh,23.89vw)]">
            <img src={TEAM_TWO.logo} alt={TEAM_TWO.name} className="size-full object-cover rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
};

function MatchRow({ match }: { match: MatchRowData }) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative h-[min(5.65vh,5.65vw)] w-[min(56.3vh,56.3vw)] shrink-0">
        <img src="/images/test/round-label-bg.svg" alt="" className="absolute inset-0 size-full" />
        <p className="absolute inset-0 flex items-center justify-center font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase">
          {match.label}
        </p>
      </div>

      <div className="flex w-full items-stretch border border-white/[0.12] overflow-hidden">
        {match.doubles ? (
          <>
            <PlayerPairPanel top={match.playerOneTop} bottom={match.playerOneBottom} rounded="left" />
            <VsPill tall />
            <PlayerPairPanel top={match.playerTwoTop} bottom={match.playerTwoBottom} rounded="right" />
          </>
        ) : (
          <>
            <PlayerPanel name={match.playerOne} align="right" rounded="left" />
            <VsPill />
            <PlayerPanel name={match.playerTwo} align="left" rounded="right" />
          </>
        )}
      </div>
    </div>
  );
}

function PlayerPanel({
  name,
  align,
  rounded,
}: {
  name: string;
  align: 'left' | 'right';
  rounded: 'left' | 'right';
}) {
  return (
    <div
      className={`flex-1 min-w-0 flex items-center h-[min(7.41vh,7.41vw)] border border-[#E39CF5] py-[min(1.48vh,1.48vw)] px-[min(1.85vh,1.85vw)] ${
        align === 'right' ? 'justify-end' : 'justify-start'
      } ${rounded === 'left' ? 'rounded-l-[4px]' : 'rounded-r-[4px]'}`}
      style={{ backgroundImage: PANEL_GRADIENT }}
    >
      <p className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {name}
      </p>
    </div>
  );
}

function PlayerPairPanel({
  top,
  bottom,
  rounded,
}: {
  top: string;
  bottom: string;
  rounded: 'left' | 'right';
}) {
  return (
    <div
      className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-[min(1.85vh,1.85vw)] h-[min(13.33vh,13.33vw)] border border-[#E39CF5] py-[min(2.04vh,2.04vw)] ${
        rounded === 'left' ? 'rounded-l-[4px]' : 'rounded-r-[4px]'
      }`}
      style={{ backgroundImage: PANEL_GRADIENT }}
    >
      <p className="w-full font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase text-center truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {top}
      </p>
      <img src="/images/test/divider-line.svg" alt="" className="w-full h-[min(0.37vh,0.37vw)]" />
      <p className="w-full font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase text-center truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {bottom}
      </p>
    </div>
  );
}

function VsPill({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center bg-[#AB51C6] border border-[#E3A9F2] px-[min(1.3vh,1.3vw)] ${
        tall ? 'h-[min(13.33vh,13.33vw)]' : 'h-[min(7.41vh,7.41vw)]'
      }`}
    >
      <p className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-score-text text-box-trim uppercase">
        vs
      </p>
    </div>
  );
}

export default TestScreen;
