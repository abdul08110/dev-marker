import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { formatTimeMatchTime } from '@/utils/functions';
import { LineupResponse, LineupSubItem } from '@/api/app/types/lineup';

interface LineupProps {
  data: LineupResponse;
  isTv?: boolean;
}

const PANEL_GRADIENT = 'radial-gradient(circle, rgba(71,43,108,0.5) 0%, rgba(47,31,79,0.75) 34%, rgba(24,19,50,1) 68%)';

const STATUS_STYLES: Record<LineupSubItem['status'], string> = {
  COMPLETED: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
  LIVE: 'bg-amber-500/20 border-amber-400 text-amber-300',
  PENDING: 'bg-white/10 border-white/30 text-white/60',
};

export function Lineup({ data, isTv }: LineupProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: isTv ? 40 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] py-[min(2vh,2vw)] bg-no-repeat flex flex-col overflow-hidden"
    >
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(3vh,3vw)] py-[min(1.1vh,1.1vw)] w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-[min(10vh,10vw)]"
            fallback="/images/user-dummy-pic.jpg"
            src={data.tournamentTeamOne.logo}
          />
          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {data.tournamentTeamOne.name}
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

      <FixtureHeader data={data} />

      <div className="flex-1 min-h-0 flex items-stretch gap-[min(2vh,2vw)] mt-[min(2.5vh,2.5vw)]">
        <div className="shrink-0 size-[min(18vh,18vw)] self-center">
          <ImageWithFallback
            className="size-full object-cover rounded-full"
            fallback="/images/user-dummy-pic.jpg"
            src={data.tournamentTeamOne.logo}
            alt={data.tournamentTeamOne.name}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-[min(2vh,2vw)] px-[min(1vh,1vw)]">
          {data.tournamentSubItems.map((subItem) => (
            <GameRow key={subItem.id} subItem={subItem} />
          ))}
        </div>

        <div className="shrink-0 size-[min(18vh,18vw)] self-center">
          <ImageWithFallback
            className="size-full object-cover rounded-full"
            fallback="/images/user-dummy-pic.jpg"
            src={data.tournamentTeamTwo.logo}
            alt={data.tournamentTeamTwo.name}
          />
        </div>
      </div>
    </motion.main>
  );
}

function FixtureHeader({ data }: { data: LineupResponse }) {
  return (
    <div className="flex items-stretch h-[min(9vh,9vw)] border border-white/[0.12] overflow-hidden shrink-0 mt-[min(2vh,2vw)]">
      <div className="flex-1 flex items-center gap-[min(1.3vh,1.3vw)] bg-[#AB51C6] border border-[#E3A9F2] rounded-l-[6px] px-[min(1.5vh,1.5vw)] min-w-0">
        <ImageWithFallback
          className="size-[min(6vh,6vw)] object-cover rounded-full shrink-0"
          fallback="/images/user-dummy-pic.jpg"
          src={data.tournamentTeamOne.logo}
          alt={data.tournamentTeamOne.name}
        />
        <p className="font-bold text-[min(4vh,4vw)] leading-[130%] text-white text-box-trim uppercase truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
          {data.tournamentTeamOne.name}
        </p>
      </div>
      <div
        className="shrink-0 flex items-center justify-center border border-[#E39CF5] px-[min(3.7vh,3.7vw)] py-[min(1.48vh,1.48vw)]"
        style={{ backgroundImage: PANEL_GRADIENT }}
      >
        <p className="font-semibold text-[min(4.2vh,4.2vw)] leading-[130%] text-score-text text-box-trim">
          {data.teamOneScore} — {data.teamTwoScore}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-end gap-[min(1.3vh,1.3vw)] bg-[#AB51C6] border border-[#E3A9F2] rounded-r-[6px] px-[min(1.5vh,1.5vw)] min-w-0">
        <p className="font-bold text-[min(4vh,4vw)] leading-[130%] text-white text-box-trim uppercase truncate text-right drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
          {data.tournamentTeamTwo.name}
        </p>
        <ImageWithFallback
          className="size-[min(6vh,6vw)] object-cover rounded-full shrink-0"
          fallback="/images/user-dummy-pic.jpg"
          src={data.tournamentTeamTwo.logo}
          alt={data.tournamentTeamTwo.name}
        />
      </div>
    </div>
  );
}

function GameRow({ subItem }: { subItem: LineupSubItem }) {
  const { gameFormat } = subItem;
  const isDoubles = gameFormat.noOfPlayers > 2;
  const score = subItem.match ? `${subItem.match.teamOneScore} - ${subItem.match.teamTwoScore}` : '— - —';

  return (
    <div className="flex flex-col items-center w-full shrink-0">
      <div className="relative h-[min(4.8vh,4.8vw)] w-[min(50vh,50vw)] shrink-0 flex items-center justify-center gap-[min(1vh,1vw)]">
        <img src="/images/test/round-label-bg.svg" alt="" className="absolute inset-0 size-full" />
        <p className="relative font-semibold text-[min(3.2vh,3.2vw)] leading-[130%] text-score-text text-box-trim uppercase">
          Game {gameFormat.matchNo} · {gameFormat.categoryName} · {gameFormat.name}
        </p>
        <span
          className={`relative shrink-0 border rounded-full px-[min(1vh,1vw)] py-[min(0.2vh,0.2vw)] text-[min(2.2vh,2.2vw)] font-semibold uppercase ${STATUS_STYLES[subItem.status]}`}
        >
          {subItem.status}
        </span>
      </div>

      <div className="flex w-full items-stretch border border-white/[0.12] overflow-hidden">
        {isDoubles ? (
          <>
            <PlayerPairPanel
              top={subItem.teamOnePlayerOne?.name ?? 'TBD'}
              bottom={subItem.teamOnePlayerTwo?.name ?? 'TBD'}
              rounded="left"
              handicap={gameFormat.isHandicapAllowed && subItem.teamOneHandicap > 0 ? subItem.teamOneHandicap : null}
              isWinner={subItem.teamWinningIndex === 1}
            />
            <ScorePill score={score} tall />
            <PlayerPairPanel
              top={subItem.teamTwoPlayerOne?.name ?? 'TBD'}
              bottom={subItem.teamTwoPlayerTwo?.name ?? 'TBD'}
              rounded="right"
              handicap={gameFormat.isHandicapAllowed && subItem.teamTwoHandicap > 0 ? subItem.teamTwoHandicap : null}
              isWinner={subItem.teamWinningIndex === 2}
            />
          </>
        ) : (
          <>
            <PlayerPanel
              name={subItem.teamOnePlayerOne?.name ?? 'TBD'}
              align="right"
              rounded="left"
              handicap={gameFormat.isHandicapAllowed && subItem.teamOneHandicap > 0 ? subItem.teamOneHandicap : null}
              isWinner={subItem.teamWinningIndex === 1}
            />
            <ScorePill score={score} />
            <PlayerPanel
              name={subItem.teamTwoPlayerOne?.name ?? 'TBD'}
              align="left"
              rounded="right"
              handicap={gameFormat.isHandicapAllowed && subItem.teamTwoHandicap > 0 ? subItem.teamTwoHandicap : null}
              isWinner={subItem.teamWinningIndex === 2}
            />
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
  handicap,
  isWinner,
}: {
  name: string;
  align: 'left' | 'right';
  rounded: 'left' | 'right';
  handicap: number | null;
  isWinner: boolean;
}) {
  return (
    <div
      className={`flex-1 min-w-0 flex items-center gap-[min(1vh,1vw)] h-[min(6.5vh,6.5vw)] border py-[min(1.3vh,1.3vw)] px-[min(1.6vh,1.6vw)] ${
        isWinner ? 'border-emerald-400' : 'border-[#E39CF5]'
      } ${align === 'right' ? 'justify-end' : 'justify-start'} ${
        rounded === 'left' ? 'rounded-l-[4px]' : 'rounded-r-[4px]'
      }`}
      style={{ backgroundImage: PANEL_GRADIENT }}
    >
      {isWinner && <span className="text-emerald-400 shrink-0">●</span>}
      <p className="font-semibold text-[min(3.2vh,3.2vw)] leading-[130%] text-score-text text-box-trim uppercase truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {name}
      </p>
      {handicap !== null && <HandicapBadge value={handicap} />}
    </div>
  );
}

function PlayerPairPanel({
  top,
  bottom,
  rounded,
  handicap,
  isWinner,
}: {
  top: string;
  bottom: string;
  rounded: 'left' | 'right';
  handicap: number | null;
  isWinner: boolean;
}) {
  return (
    <div
      className={`relative flex-1 min-w-0 flex flex-col items-center justify-center gap-[min(1.6vh,1.6vw)] h-[min(11.6vh,11.6vw)] border py-[min(1.8vh,1.8vw)] ${
        isWinner ? 'border-emerald-400' : 'border-[#E39CF5]'
      } ${rounded === 'left' ? 'rounded-l-[4px]' : 'rounded-r-[4px]'}`}
      style={{ backgroundImage: PANEL_GRADIENT }}
    >
      {handicap !== null && (
        <div className="absolute top-[min(0.5vh,0.5vw)] right-[min(0.5vh,0.5vw)]">
          <HandicapBadge value={handicap} />
        </div>
      )}
      <p className="w-full font-semibold text-[min(3.2vh,3.2vw)] leading-[130%] text-score-text text-box-trim uppercase text-center truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {top}
      </p>
      <img src="/images/test/divider-line.svg" alt="" className="w-full h-[min(0.32vh,0.32vw)]" />
      <p className="w-full font-semibold text-[min(3.2vh,3.2vw)] leading-[130%] text-score-text text-box-trim uppercase text-center truncate drop-shadow-[0px_1px_2px_rgba(0,0,0,0.98)]">
        {bottom}
      </p>
    </div>
  );
}

function ScorePill({ score, tall }: { score: string; tall?: boolean }) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center bg-[#AB51C6] border border-[#E3A9F2] px-[min(1.3vh,1.3vw)] ${
        tall ? 'h-[min(11.6vh,11.6vw)]' : 'h-[min(6.5vh,6.5vw)]'
      }`}
    >
      <p className="font-semibold text-[min(3.2vh,3.2vw)] leading-[130%] text-score-text text-box-trim uppercase">
        {score}
      </p>
    </div>
  );
}

function HandicapBadge({ value }: { value: number }) {
  return (
    <span className="shrink-0 bg-black/40 border border-white/30 rounded-full px-[min(0.9vh,0.9vw)] text-[min(2.2vh,2.2vw)] font-semibold text-white">
      +{value}
    </span>
  );
}

export default Lineup;
