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
    <section className="h-screen w-screen flex flex-col">
      <div className="bg-primary text-center text-white font-bold text-[min(4vh,4vw)] border border-white h-[5vh] flex items-center justify-center">
        {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
      </div>
      <div className="relative flex-grow grid grid-cols-12 h-[90vh] overflow-hidden">
        <div
          className={clsx(
            'col-span-5 p-[min(4vh,4vw)] h-full overflow-auto rounded-md bg-black flex flex-col gap-[min(2vh,2vw)]',
          )}
        >
          <div className="h-[30%] w-full relative">
            <PlayerImage
              profilePhoto={state.tournamentId ? state.teamOneLogo : state.sideOnePlayerOne.profilePhoto}
              profilePhoto2={state.tournamentId ? undefined : state.sideOnePlayerTwo?.profilePhoto}
            />
          </div>

          <div className={clsx('w-full h-[35%]')}>
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

          <div className={clsx('w-full h-[35%]')}>
            <TeamScore
              score={teamOneScore}
              isActive={isTeamOneActive}
              breakScore={activeTurn?.score}
              isTournament={!!state.tournamentId}
              big
            />
          </div>

          {/* <div
            className={clsx('w-full h-[15%]', {
              'flex items-center justify-center': state.sport !== 'SNOOKER',
            })}
          >
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideOnePlayerOne, state.sideOnePlayerTwo]}
              />
            ) : (
              <img
                className={clsx('object-contain aspect-square size-[min(8vh,8vw)]')}
                src={'/images/yellow-ball.png'}
              />
            )}
          </div> */}
        </div>

        <div className="col-span-2 h-full border-l border-r border-white">
          <div className="h-1/4 relative flex justify-center items-center">
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div>

            {state.tournamentId === null ? (
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
          <div className="h-1/4 relative flex justify-center items-center">
            <img src="/images/clubliv-icon.png" alt="Logo" className="h-[80%] w-auto aspect-square object-contain" />
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div>
          </div>
          <div className="h-1/4 relative">
            <GameScore
              teamOneScore={state.teamOneScore}
              teamTwoScore={state.teamTwoScore}
              noOfFrames={state.tournamentId ? state.tournamentSubItem?.gameFormat.noOfSets : state.sets.length}
            />
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div>
          </div>
          <div className="h-1/4 flex justify-center items-center">
            <VenueNo venueNo={state.venueNo || 0} />
          </div>
        </div>

        {/* Team Two Side */}
        <div
          className={clsx(
            'col-span-5 p-[min(4vh,4vw)] h-full overflow-auto rounded-md bg-black flex flex-col gap-[min(2vh,2vw)]',
          )}
        >
          <div className="h-[30%] w-full relative">
            <PlayerImage
              profilePhoto={state.tournamentId ? state.teamTwoLogo : state.sideTwoPlayerOne.profilePhoto}
              profilePhoto2={state.tournamentId ? undefined : state.sideTwoPlayerTwo?.profilePhoto}
            />
          </div>

          <div className={clsx('w-full h-[35%]')}>
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
          </div>

          <div className={clsx('w-full h-[35%]')}>
            <TeamScore
              score={teamTwoScore}
              isActive={isTeamTwoActive}
              breakScore={activeTurn?.score}
              isTournament={!!state.tournamentId}
              big
            />
          </div>

          {/* <div
            className={clsx('w-full h-[15%]', {
              'flex items-center justify-center': state.sport !== 'SNOOKER',
            })}
          >
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideOnePlayerOne, state.sideOnePlayerTwo]}
              />
            ) : (
              <img
                className={clsx('object-contain aspect-square size-[min(8vh,8vw)]')}
                src={'/images/white-ball.png'}
              />
            )}
          </div> */}
        </div>
      </div>
      <div className="bg-primary text-center text-white font-bold text-[min(4vh,4vw)] border border-white h-[5vh] flex items-center justify-center">
        {state.tournamentId && state.tournamentSubItem
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
      <div className="flex justify-center items-center h-full w-full relative">
        <img
          className="rounded-full overflow-hidden h-[90%] w-auto aspect-square object-cover border-4 border-purple-500 z-10 absolute left-1/4"
          src={profilePhoto ? profilePhoto : '/images/user-dummy-pic.jpg'}
          style={{ zIndex: 2 }}
        />
        <img
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
      <img
        className="rounded-md overflow-hidden h-full w-auto aspect-square object-cover"
        src={profilePhoto ? profilePhoto : '/images/user-dummy-pic.jpg'}
      />
    </div>
  );
}

// Venue No Component
function VenueNo({ venueNo }: { venueNo: number }) {
  return <span className="text-white font-bold uppercase text-[min(12vh,12vw)]">T{venueNo}</span>;
}

// Timer Component
function Timer({ timeLeft }: { timeLeft: number }) {
  return (
    <div className="flex flex-col justify-start items-center">
      <span className="text-center text-white text-[min(3vh,3vw)]">Time Left (mins):</span>
      <strong className="text-center text-white text-[min(9vh,9vw)] leading-[1]">
        {formatTime(timeLeft)}
      </strong>
    </div>
  );
}

// Snooker Point Display Component
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
    <div className="flex flex-col gap-[min(1vh,1vw)] overflow-auto h-full justify-start items-center col-span-1">
      <div
        className={clsx('rounded-lg flex items-center justify-center border-4', {
          // Active: yellow/orange gradient box
          'bg-gradient-to-b from-yellow-400 to-orange-500 border-yellow-300 shadow-lg': isActive,
          // Not active: white/gray box
          'bg-gradient-to-b from-gray-100 to-gray-300 border-gray-300': !isActive,
          'w-[min(28vh,28vw)] h-[min(18vh,18vw)]': big,
          'w-[min(25vh,25vw)] h-[min(16vh,16vw)]': !big,
        })}
      >
        <span
          className={clsx('font-bold leading-none text-black', {
            'text-[min(16vh,16vw)]': big,
            'text-[min(15vh,15vw)]': !big,
          })}
        >
          {score}
        </span>
      </div>
      {isActive && (
        <span
          className={clsx('text-yellow-400 font-bold', {
            'text-[min(6vh,6vw)]': true,
          })}
        >
          BREAK {breakScore}
        </span>
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
  isTournament,
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
          'text-[min(7vh,7vw)]': isSingles,
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
      <div className="flex flex-col items-center gap-2">
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
          <span className={clsx({ 'text-yellow-500': isPlayerOneActive })}>
            {getDisplayName(playerOneName)}
          </span>
        )}
        {handicap && (
          <span className="text-[min(5vh,5vw)] mt-2">
            ({convertHandicapToString(handicap)})
          </span>
        )}
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
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <span className="text-white font-bold text-[min(3.5vh,3.5vw)]">GAME SCORE</span>
      <span className="text-white font-bold text-[min(7vh,7vw)]">
        {teamOneScore} {noOfFrames ? `(${noOfFrames})` : ''} {teamTwoScore}
      </span>
    </div>
  );
}
