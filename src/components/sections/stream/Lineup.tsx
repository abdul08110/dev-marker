import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { LineupResponse, LineupSubItem } from '@/api/app/types/lineup';

interface LineupProps {
  data: LineupResponse;
  isTv?: boolean;
  clubName?: string | null;
  clubLogo?: string | null;
}

function formatMatchDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

const MAX_VISIBLE_GAMES = 4;
const PANEL_GRADIENT = 'radial-gradient(circle, rgba(71,43,108,0.5) 0%, rgba(47,31,79,0.75) 34%, rgba(24,19,50,1) 68%)';
const BORDER_COLOR = 'rgba(227, 156, 245, 0.3)';

export function Lineup({ data, isTv, clubName, clubLogo }: LineupProps) {
  const visibleGames = data.tournamentSubItems.slice(0, MAX_VISIBLE_GAMES);

  return (
    <motion.main
      initial={{ opacity: 0, y: isTv ? 40 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="h-screen w-screen flex flex-col overflow-hidden bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center bg-no-repeat"
      style={{
        padding: 'min(2vw, 2vh) min(4vw, 4vh)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between shrink-0" style={{ paddingBottom: 'min(1vw, 1vh)' }}>
        <div className="flex items-center min-w-0 flex-1" style={{ gap: 'min(1.5vw, 1.5vh)' }}>
          {clubLogo && (
            <ImageWithFallback
              className="object-cover rounded-full shrink-0"
              style={{ width: 'min(7vw, 7vh)', height: 'min(7vw, 7vh)' }}
              fallback="/images/user-dummy-pic.jpg"
              src={clubLogo}
            />
          )}
          {clubName && (
            <p className="text-white font-medium uppercase truncate" style={{ fontSize: 'min(3vw, 3vh)' }}>
              {clubName}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <ImageWithFallback
            className="h-auto"
            style={{ width: 'min(25vw, 25vh)' }}
            fallback="/images/clubliv-final-logo.png"
            src="/images/logos/clubliv-logo.svg"
          />
        </div>
        <div className="flex-1 flex justify-end">
          {data.tournamentSubItems[0]?.dateScheduled && (
            <p className="text-white font-medium" style={{ fontSize: 'min(2.5vw, 2.5vh)' }}>
              {formatMatchDate(data.tournamentSubItems[0].dateScheduled)}
            </p>
          )}
        </div>
      </div>

      {/* Divider below top bar */}
      <div className="shrink-0" style={{ height: '2px', background: `linear-gradient(to right, transparent, ${BORDER_COLOR} 15%, ${BORDER_COLOR} 85%, transparent)` }} />

      {/* Content area — 90% height, centered */}
      <div className="flex-1 flex flex-col justify-center items-center" style={{ height: '90%' }}>

        {/* Fixture header with team logos — 20% */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: '20%', gap: 'min(2vw, 2vh)' }}
        >
          {/* Left team logo */}
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{
              width: 'min(18vw, 18vh)',
              height: 'min(18vw, 18vh)',
              border: '2px solid rgba(100, 70, 180, 0.5)',
              boxShadow: '0 0 30px rgba(80, 50, 160, 0.4)',
            }}
          >
            <ImageWithFallback className="size-full object-cover" fallback="/images/user-dummy-pic.jpg" src={data.tournamentTeamOne.logo} />
          </div>

          <div className="flex items-stretch overflow-hidden flex-1 min-w-0" style={{ maxHeight: 'min(7vw, 7vh)', height: '100%', border: `2px solid ${BORDER_COLOR}`, borderRadius: 'min(0.8vw, 0.8vh)' }}>
            <div
              className="flex-1 flex items-center justify-center min-w-0"
              style={{ padding: '0 min(2vw, 2vh)', backgroundImage: PANEL_GRADIENT }}
            >
              <p className="font-bold text-white uppercase truncate" style={{ fontSize: 'min(2.8vw, 2.8vh)' }}>
                {data.tournamentTeamOne.name}
              </p>
            </div>
            <div
              className="shrink-0 flex items-center justify-center bg-[#AB51C6]"
              style={{ padding: '0 min(3vw, 3vh)' }}
            >
              <p className="font-bold text-white whitespace-nowrap" style={{ fontSize: 'min(2.8vw, 2.8vh)' }}>
                VS
              </p>
            </div>
            <div
              className="flex-1 flex items-center justify-center min-w-0"
              style={{ padding: '0 min(2vw, 2vh)', backgroundImage: PANEL_GRADIENT }}
            >
              <p className="font-bold text-white uppercase truncate" style={{ fontSize: 'min(2.8vw, 2.8vh)' }}>
                {data.tournamentTeamTwo.name}
              </p>
            </div>
          </div>

          {/* Right team logo */}
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{
              width: 'min(18vw, 18vh)',
              height: 'min(18vw, 18vh)',
              border: '2px solid rgba(100, 70, 180, 0.5)',
              boxShadow: '0 0 30px rgba(80, 50, 160, 0.4)',
            }}
          >
            <ImageWithFallback className="size-full object-cover" fallback="/images/user-dummy-pic.jpg" src={data.tournamentTeamTwo.logo} />
          </div>
        </div>

        {/* Lineup area — 75%, aligned with fixture header */}
        <div
          className="w-full flex items-center"
          style={{ height: '75%', paddingLeft: 'calc(min(18vw, 18vh) + min(2vw, 2vh))', paddingRight: 'calc(min(18vw, 18vh) + min(2vw, 2vh))' }}
        >
          {/* Game rows */}
          <div
            className="flex-1 min-w-0 h-full flex flex-col justify-center"
            style={{ gap: 'min(1.5vw, 1.5vh)' }}
          >
            {visibleGames.map((subItem, index) => (
              <GameRow key={subItem.id} subItem={subItem} />
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function GameRow({ subItem }: { subItem: LineupSubItem }) {
  const { gameFormat } = subItem;
  const isDoubles = gameFormat.noOfPlayers > 2;
  const isCompleted = subItem.status === 'COMPLETED' && subItem.match;
  const centerText = isCompleted
    ? `${subItem.match!.currentSetTeamOneScore} - ${subItem.match!.currentSetTeamTwoScore}`
    : 'VS';

  return (
    <div className="flex flex-col items-center w-full" style={{ flex: '0 0 auto' }}>
      {/* Game label — trapezoid SVG background */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: '60%' }}>
        <img src="/images/test/round-label-bg.svg" alt="" className="absolute inset-0 w-full h-full" />
        <p
          className="relative font-medium text-white uppercase truncate text-center"
          style={{ fontSize: 'min(2.8vw, 2.8vh)', padding: 'min(0.8vw, 0.8vh) 0' }}
        >
          {gameFormat.name} {gameFormat.categoryName}
        </p>
      </div>

      {/* Player row */}
      <div
        className="flex w-full items-stretch overflow-hidden"
        style={{
          border: `2px solid ${BORDER_COLOR}`,
          borderRadius: 'min(0.8vw, 0.8vh)',
          marginTop: 'min(0.1vw, 0.1vh)',
        }}
      >
        {isDoubles ? (
          <>
            <PlayerPairPanel top={subItem.teamOnePlayerOne?.name ?? 'TBD'} bottom={subItem.teamOnePlayerTwo?.name ?? 'TBD'} />
            <ScorePill score={centerText} tall />
            <PlayerPairPanel top={subItem.teamTwoPlayerOne?.name ?? 'TBD'} bottom={subItem.teamTwoPlayerTwo?.name ?? 'TBD'} />
          </>
        ) : (
          <>
            <PlayerPanel name={subItem.teamOnePlayerOne?.name ?? 'TBD'} align="right" />
            <ScorePill score={centerText} />
            <PlayerPanel name={subItem.teamTwoPlayerOne?.name ?? 'TBD'} align="left" />
          </>
        )}
      </div>
    </div>
  );
}

function PlayerPanel({ name, align }: { name: string; align: 'left' | 'right' }) {
  return (
    <div
      className="flex-1 min-w-0 flex items-center justify-center"
      style={{
        padding: 'min(1.5vw, 1.5vh) min(3vw, 3vh)',
        backgroundImage: PANEL_GRADIENT,
      }}
    >
      <p className="font-medium text-white uppercase truncate" style={{ fontSize: 'min(2.8vw, 2.8vh)' }}>
        {name}
      </p>
    </div>
  );
}

function PlayerPairPanel({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col items-center justify-center"
      style={{
        padding: 'min(0.5vw, 0.5vh)',
        gap: 'min(0.5vw, 0.5vh)',
        backgroundImage: PANEL_GRADIENT,
      }}
    >
      <p className="w-full font-medium text-white uppercase text-center truncate" style={{ fontSize: 'min(2.8vw, 2.8vh)', padding: '0 min(2vw, 2vh)' }}>
        {top}
      </p>
      <div className="bg-gradient-to-r from-transparent via-[#AB51C6]/80 to-transparent" style={{ width: '80%', height: '1px' }} />
      <p className="w-full font-medium text-white uppercase text-center truncate" style={{ fontSize: 'min(2.8vw, 2.8vh)', padding: '0 min(2vw, 2vh)' }}>
        {bottom}
      </p>
    </div>
  );
}

function ScorePill({ score }: { score: string; tall?: boolean }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center bg-[#AB51C6]"
      style={{ width: 'min(12vw, 12vh)', padding: '0 min(1vw, 1vh)' }}
    >
      <p className="font-bold text-white uppercase whitespace-nowrap" style={{ fontSize: 'min(3.2vw, 3.2vh)' }}>
        {score}
      </p>
    </div>
  );
}

export default Lineup;
