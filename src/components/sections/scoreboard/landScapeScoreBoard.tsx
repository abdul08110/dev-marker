import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ScoreBoardState } from '@/hooks/useScoreboard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { convertHandicapToString, formatTime } from '@/utils/functions';
import clsx from 'clsx';

interface LandscapeScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

export function LandscapeScoreboard({ state, timeLeft }: LandscapeScoreBoardProps) {
  const activeSet = getActiveSet(state.sets);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive =
    state.sideOnePlayerOne?.id === state.activePlayerId || state.sideOnePlayerTwo?.id === state.activePlayerId;
  const isTeamTwoActive =
    state.sideTwoPlayerOne?.id === state.activePlayerId || state.sideTwoPlayerTwo?.id === state.activePlayerId;
  const isTeamReveresed =
    state.tournamentId && state.tournamentSubItem
      ? state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== state.tournamentTeamOneId
      : false;

  const teamOneScore = activeSet ? activeSet.teamOneScore : 0;

  const teamTwoScore = activeSet ? activeSet.teamTwoScore : 0;

  return (
    <section className="lg:h-screen h-full w-screen flex flex-col">
      <div className="bg-primary text-center relative bg-[url('/images/imagebackground.png')] bg-cover bg-right text-center overflow-hidden  text-white font-bold text-[min(4vh,4vw)] border-b border-[rgba(255,255,255,0.12)] h-[7vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <span className="relative z-10">
          {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
        </span>
      </div>
      <div className="relative flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 lg:h-[90vh] h-full overflow-hidden">
        <div
          className={clsx(
            'col-span-1 md:col-span-5 flex flex-col h-full overflow-auto rounded-md bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)]',
          )}
        >
          <div className="flex justify-between h-[25vh] md:h-1/4 items-start border-b border-[#FFFFFF1F] w-full relative bg-[linear-gradient(270deg,#1D0F1B_0%,#0D2014_100%)]">
            <PlayerImage
              profilePhoto={state.tournamentId && state.tournamentSubItem !== null ? state.teamOneLogo : state.sideOnePlayerOne.profilePhoto}
              profilePhoto2={state.tournamentId ? undefined : state.sideOnePlayerTwo?.profilePhoto}
            />
            <Player
              playerOneName={state.sideOnePlayerOne.name}
              playerTwoName={state.sideOnePlayerTwo ? state.sideOnePlayerTwo.name : undefined}
              ballToShow={state.sport === 'BILLIARDS' && state.tournamentId === null ? 'YELLOW' : null}
              isActive={isTeamOneActive}
              handicap={state.teamOneHandicap}
              isTournament={!!state.tournamentId}
              activePlayerId={state.activePlayerId}
              playerOneId={state.sideOnePlayerOne.id}
              playerTwoId={state.sideOnePlayerTwo?.id}
              isDoubles={!!state.sideOnePlayerTwo}
            />
          </div>

          <div className={clsx('w-full h-[75vh] md:h-3/4 border-b border-[#FFFFFF1F]')}>
            <TeamScore
              score={teamOneScore}
              isActive={isTeamOneActive}
              breakScore={activeTurn?.score}
              isTournament={!!state.tournamentId}
              big
            />
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 lg:col-span-2 h-auto md:h-full border-l border-r border-[rgba(255,255,255,0.12)] bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)]">
          <div className="h-[20vh] md:h-1/4 relative flex justify-center w-full items-center">
            {/* <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div> */}

            {state.tournamentId === null || state.tournamentSubItem === null ? (
              <Timer timeLeft={timeLeft} />
            ) : (
              <TournamentScore
                teamOneScore={
                  isTeamReveresed
                    ? state.tournamentSubItem?.tournamentItem.teamTwoScore || 0
                    : state.tournamentSubItem?.tournamentItem.teamOneScore || 0
                }
                teamTwoScore={
                  isTeamReveresed
                    ? state.tournamentSubItem?.tournamentItem.teamOneScore || 0
                    : state.tournamentSubItem?.tournamentItem.teamTwoScore || 0
                }
                noOfFrames={state.tournamentSubItem?.tournamentItem.tournamentPhase.tournamentFormats.length}
              />
            )}
          </div>
          <div className="h-[12vh] md:h-1/6 relative border-t border-b border-[rgba(255,255,255,0.12)] flex justify-center items-center bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)]">
            <img src="/images/clubliv-logo-team.png" alt="Logo" className="h-[70%] w-auto aspect-square object-cover" />
            {/* <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div> */}
          </div>
          <div className="h-[20vh] md:h-[40%] relative">
            <GameScore
              teamOneScore={state.teamOneScore}
              teamTwoScore={state.teamTwoScore}
              noOfFrames={
                state.tournamentId
                  ? state.tournamentSubItem
                    ? state.tournamentSubItem?.gameFormat.noOfSets
                    : 5
                  : state.sets.length
              }
            />
          </div>

          <div className="h-[15vh] md:h-1/6 flex justify-center border-t border-solid [border-image-source:linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.56)_50%,rgba(255,255,255,0)_100%)] items-center [border-image-slice:1]">
            <VenueNo venueNo={state.venueNo || 0} />
          </div>
        </div>

        {/* Team Two Side */}
        <div
          className={clsx(
            'col-span-1 md:col-span-5 h-full overflow-auto rounded-md bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)] flex flex-col',
          )}
        >
          <div className="h-[25vh] md:h-[25%] flex justify-between items-start p-[min(2vh,2vw)] border-b border-[#FFFFFF1F] w-full relative bg-[linear-gradient(270deg,#290A0A_0%,#1D0F1B_100%)]">
            <Player
              playerOneName={state.sideTwoPlayerOne.name}
              playerTwoName={state.sideTwoPlayerTwo ? state.sideTwoPlayerTwo.name : undefined}
              ballToShow={state.sport === 'BILLIARDS' && state.tournamentId === null ? 'WHITE' : null}
              isActive={isTeamTwoActive}
              handicap={state.teamTwoHandicap}
              isTournament={!!state.tournamentId}
              activePlayerId={state.activePlayerId}
              playerOneId={state.sideTwoPlayerOne.id}
              playerTwoId={state.sideTwoPlayerTwo?.id}
              isDoubles={!!state.sideTwoPlayerTwo}
            />
            <PlayerImage
              profilePhoto={state.tournamentId && state.tournamentSubItem !== null ? state.teamTwoLogo : state.sideTwoPlayerOne.profilePhoto}
              profilePhoto2={state.tournamentId ? undefined : state.sideTwoPlayerTwo?.profilePhoto}
            />
          </div>
          <div className={clsx('w-full h-[75vh] md:h-[75%]')}>
            <TeamScore
              score={teamTwoScore}
              isActive={isTeamTwoActive}
              breakScore={activeTurn?.score}
              isTournament={!!state.tournamentId}
              big
            />
          </div>
        </div>
      </div>
      <div className="text-center text-white font-bold bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)] text-[min(4vh,4vw)] border-t h-[7vh] flex items-center justify-center"
        style={{
          borderImageSource: 'linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.12) 100%)',
          borderImageSlice: 1
        }}>        {state.tournamentId && state.tournamentSubItem
          ? `GAME #${state.tournamentSubItem.gameFormat.matchNo} | ${state.tournamentSubItem.gameFormat.name} | ${state.tournamentSubItem.tournamentItem.tournamentPhase.name}`
          : state.format}
      </div>
    </section>
  );
}

// Player Image Component
function PlayerImage({ profilePhoto, profilePhoto2 }: { profilePhoto?: string | null; profilePhoto2?: string | null }) {
  // If doubles (profilePhoto2 is defined), always show two images
  if (typeof profilePhoto2 !== 'undefined') {
    return (
      <div className="flex justify-center  items-center h-full w-full relative">
        <ImageWithFallback
          className="rounded-full overflow-hidden h-[90%] w-auto aspect-square object-cover border-4 border-purple-500 z-10 absolute left-1/4"
          src={profilePhoto ? profilePhoto : '/images/user-dummy-pic.jpg'}
          fallback={'/images/user-dummy-pic.jpg'}
          style={{ zIndex: 2 }}
        />
        <ImageWithFallback
          fallback={'/images/user-dummy-pic.jpg'}
          className="rounded-full overflow-hidden h-[90%] w-auto aspect-square object-cover border-4 border-purple-500 z-0 absolute right-1/4"
          src={profilePhoto2 ? profilePhoto2 : '/images/user-dummy-pic.jpg'}
          style={{ zIndex: 1 }}
        />
      </div>
    );
  }
  // Singles: Only one photo
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className="relative w-24 h-24 md:w-36 md:h-36 bg-[#FFD400] rounded-xl [clip-path:polygon(25%_0%,100%_0,100%_50%,100%_100%,0_100%,0%_50%)]"
      >
        <img
          src={profilePhoto ?? '/images/user-dummy-pic.jpg'}
          alt="Player"
          className="absolute top-0.5 left-0.5 rounded-xl w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover [clip-path:polygon(25%_0%,100%_0,100%_50%,100%_100%,0_100%,0%_50%)]"
        />
      </div>
    </div>


  );
}

// Venue No Component
function VenueNo({ venueNo }: { venueNo: number }) {
  return <span className="text-white font-bold uppercase text-[min(6vh,6vw)]">T{venueNo}</span>;
}

// Timer Component
function Timer({ timeLeft }: { timeLeft: number }) {
  return (
    <div className="flex flex-col justify-start items-center overflow-hidden">
      <span className="text-center text-white text-[min(3vh,3vw)]">Time Left (mins):</span>
      <strong className="text-center text-white text-[min(7vh,7vw)] leading-[1]">{formatTime(timeLeft)}</strong>
    </div>
  );
}


// function SnookerPointDisplay({ turns, players }: { turns?: any[]; players: any[] }) {
//   const activeTurnPointTypes = getSnookerPointTypesByTurns(
//     turns?.filter((value) => players.some((player) => player && value.turnPlayerId === player.id)) || [],
//   );

//   return (
//     <div className="flex justify-center items-start h-full">
//       <div className="w-full h-full">
//         <SnookerPointTypeDisplay
//           class={'360p:gap-[0.125rem] 480p:gap-1 720p:gap-1 1080p:gap-2 2k:gap-3 4k:gap-4'}
//           className={
//             ' 360p:text-[0.4rem] 360p:size-3  480p:text-[0.5rem] 720p:text-[1rem] 1080p:text-[1.3rem] 480p:h-3 480p:w-3  720p:h-5 720p:w-5 1080p:h-8 1080p:w-8 2k:h-10 2k:w-10 2k:text-[1.5rem] 4k:h-16 4k:w-16 4k:text-[2.2rem] flex justify-center'
//           }
//           activeTurnPointTypes={activeTurnPointTypes}
//         />
//       </div>
//     </div>
//   );
// }

// Team Score Component
function TeamScore({
  score,
  isActive,
  breakScore,
  big,
}: {
  score: number;
  isActive: boolean;
  breakScore?: number;
  isTournament: boolean;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col h-full w-full">
      <div
        className={clsx(
          'flex flex-col w-full !h-3/4 items-center justify-center leading-none',
          {
            'bg-[radial-gradient(167.8%_166.25%_at_50%_100%,#612700_0%,#FFC400_100%)] h-3/4': isActive,
            'bg-[radial-gradient(167.8%_166.25%_at_50%_100%,#00610D_0%,#00FF26_100%)] ': !isActive,
            // 'w-[min(28vh,28vw)] h-[min(18vh,18vw)]': big,
            // 'w-[min(25vh,25vw)] h-[min(16vh,16vw)]': !big,
          }
        )}

      >
        <span className="text-white font-normal text-[min(5.2vh,5.2vw)] uppercase">
          SCORE
        </span>

        <span className="font-bold text-white leading-none text-[min(20vh,20vw)]">
          {score}
        </span>
      </div>
      {isActive && (
        <div className="flex items-center justify-center h-1/4 gap-4 bg-[#272126]" >
          <img src="/images/shootingstar.png" alt="break" className="w-[clamp(1.2rem,5vh,5vw)] h-[clamp(1.2rem,5vh,5vw)]" />
          <span className="text-white font-normal text-[clamp(1rem,4vh,4vw)]">
            BREAK {breakScore}
          </span>
        </div>
      )}
    </div>
  );
}

// Player Score Component
function TournamentScore({
  teamOneScore,
  teamTwoScore,
  noOfFrames,
}: {
  teamOneScore: number;
  teamTwoScore: number;
  noOfFrames?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <span className="text-white font-bold text-[min(3.5vh,3.5vw)]">TEAM SCORE</span>
      <span className="text-white font-bold text-[min(7vh,7vw)]">
        {teamOneScore} {noOfFrames ? `(${noOfFrames})` : ''} {teamTwoScore}
      </span>
    </div>
  );
}

// Helper for name truncation logic
function getDisplayName(name: string): string {
  if (!name) return '';
  if (name.length > 15) {
    // Show only first word
    return name.split(' ')[0];
  }
  return name;
}

function Player({
  playerOneName,
  playerTwoName,
  ballToShow,
  isActive,
  handicap,
  activePlayerId,
  playerOneId,
  playerTwoId,
  isDoubles,
}: {
  playerOneName: string;
  playerTwoName?: string;
  ballToShow: 'YELLOW' | 'WHITE' | null;
  isActive: boolean;
  handicap?: number | null;
  isTournament: boolean;
  activePlayerId?: string | null;
  playerOneId?: string | null;
  playerTwoId?: string | null;
  isDoubles?: boolean;
}) {
  const isPlayerOneActive = activePlayerId && playerOneId && activePlayerId === playerOneId;
  const isPlayerTwoActive = activePlayerId && playerTwoId && activePlayerId === playerTwoId;
  const isSingles = !isDoubles;
  return (
    <div
      className={clsx(
        'flex mt-auto mb-[min(2vh,2vw)] gap-[min(2vh,2vw)] w-full justify-center items-center font-bold uppercase',
        {
          'text-yellow-500': isActive,
          'text-white': !isActive,
          'text-[min(6vh,6vw)]': isSingles,
          'text-[min(5vh,5vw)]': !isSingles,
        },
      )}
    >
      {ballToShow === 'YELLOW' && (
        <img
          className={clsx('object-contain aspect-square', {
            'size-[min(4vh,4vw)]': true,
          })}
          src={'/images/yellow-ball.png'}
        />
      )}
      <div className="flex flex-col items-center gap-2 text-center">
        {playerTwoName ? (
          // Team display - show first word or first word if > 15 chars
          <>
            <span className={clsx(isPlayerOneActive ? 'text-yellow-500' : 'text-white')}>
              {getDisplayName(playerOneName)}
            </span>
            <span className={clsx(isPlayerTwoActive ? 'text-yellow-500' : 'text-white')}>
              {getDisplayName(playerTwoName)}
            </span>
          </>
        ) : (
          // Singles display
          <span className={clsx({ 'text-yellow-500': isPlayerOneActive })}>{getDisplayName(playerOneName)}</span>
        )}
        {handicap && <span className="text-[min(5vh,5vw)] mt-2">({convertHandicapToString(handicap)})</span>}
      </div>
      {ballToShow === 'WHITE' && (
        <img
          className={clsx('object-contain aspect-square', {
            'size-[min(4vh,4vw)]': true,
          })}
          src={'/images/white-ball.png'}
        />
      )}
    </div>
  );
}

interface GameScoreProps {
  teamOneScore: number;
  teamTwoScore: number;
  noOfFrames?: number;
}

function GameScore({ teamOneScore, teamTwoScore, noOfFrames }: GameScoreProps) {
  return (
    <div className="flex flex-col px-4 items-center justify-center gap-2 h-full">
      <span className="text-white font-normal text-center text-[min(3.5vh,3.5vw)]">GAME SCORE</span>
      <div className="flex items-center w-full justify-center gap-[1px] bg-transparent rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] backdrop-blur-md">

        <div className="flex-1 flex justify-center items-center py-[0.6rem] bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%),linear-gradient(0deg,rgba(89,89,89,0.2),rgba(89,89,89,0.2))] ">
          <span className="text-white text-center font-normal text-[min(6vh,6vw)] leading-none drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]">
            {teamOneScore}
          </span>

        </div>

        <div className="flex-1 flex justify-center items-center py-[0.6rem] bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%)] border-x border-solid   [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,#ffffff_50%,rgba(255,255,255,0.12)_100%)] [border-image-slice:1] shadow-[0_0_16px_rgba(255,255,255,0.25)]">
          <span className="text-white font-normal text-[min(6vh,6vw)] leading-none">
            {noOfFrames ?? "-"}
          </span>
        </div>

        <div className="flex-1 flex justify-center items-center py-[0.6rem] bg-[linear-gradient(140.43deg,#221321_22.62%,#090109_85.13%),linear-gradient(0deg,rgba(89,89,89,0.2),rgba(89,89,89,0.2))] ">
          <span className="text-white font-normal text-[min(6vh,6vw)] leading-none drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]">
            {teamTwoScore}
          </span>
        </div>
      </div>

    </div>
  );
}