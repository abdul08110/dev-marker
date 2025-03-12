import { ScoreBoardState } from '@/hooks/useScoreboard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { convertHandicapToString, formatTime, generatePlayerName, truncateText } from '@/utils/functions';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import clsx from 'clsx';

interface LandscapeScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

export function LandscapeScoreboard({ state, timeLeft }: LandscapeScoreBoardProps) {
  const activeSet = getActiveSet(state.sets);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = state.sideOnePlayerOne.id === state.activePlayerId;
  const isTeamTwoActive = state.sideTwoPlayerOne.id === state.activePlayerId;
  // const isTeamReveresed =
  //   state.tournamentId && state.tournamentSubItem
  //     ? state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== state.tournamentTeamOneId
  //     : false;

  return (
    <section className="h-screen w-screen 480p:p-2 720p:p-4 1080p:p-6 2k:p-12 4k:p-16  360p:p-1">
      <div className="relative h-full w-full grid grid-cols-2 480p:gap-2 360p:gap-1 720p:gap-4 1080p:gap-6 2xl:gap-12 4k:gap-16">
        <div
          className={clsx(
            'col-span-1 360p:p-2 480p:p-5 720p:p-5 1080p:p-8 2k:p-12 4k:p-16 h-full  overflow-auto rounded-md',
            {
              'bg-[#5E5E5E]': !isTeamOneActive,
              'bg-primary': isTeamOneActive,
            },
          )}
        >
          <div className="h-[30%] w-full relative">
            <span className="ml-14 absolute top-1/2  transform -translate-y-1/2 text-white font-bold 360p:text-[2rem]  480p:text-[1rem] 720p:text-[5.5rem] 1080p:text-[1.8rem] 2k:text-[3.1rem] 4k:text-[5rem]">
              {/* {state.tournamentId && state.tournamentSubItem
                ? isTeamReveresed
                  ? state.tournamentSubItem?.tournamentItem.teamTwoScore!
                  : state.tournamentSubItem?.tournamentItem.teamOneScore!
                : state.teamOneScore} */}
            </span>
            <PlayerImage profilePhoto={state.tournamentId ? state.teamOneLogo : state.sideOnePlayerOne.profilePhoto} />
          </div>

          <div className="h-[20%] pt-8">
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideOnePlayerOne, state.sideOnePlayerTwo]}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="h-[35%] w-full pt-4">
            <div className="flex flex-col gap-4 h-full">
              <TeamScore
                score={activeSet ? activeSet.teamOneScore : 0}
                isActive={isTeamOneActive}
                breakScore={activeTurn?.score}
              />
              <Player
                playerOneName={state.sideOnePlayerOne.name}
                playerTwoName={state.sideOnePlayerTwo ? state.sideOnePlayerTwo.name : undefined}
                ballToShow={state.sport === 'BILLIARDS' && state.tournamentId === null ? 'YELLOW' : null}
                isActive={isTeamOneActive}
                handicap={state.teamOneHandicap}
              />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'col-span-1 360p:p-2 480p:p-5 720p:p-5 1080p:p-8 2k:p-12 4k:p-16 h-full overflow-auto rounded-md',
            {
              'bg-[#5E5E5E]': !isTeamTwoActive,
              'bg-primary': isTeamTwoActive,
            },
          )}
        >
          <div className="h-[30%] w-full relative">
            <PlayerImage profilePhoto={state.tournamentId ? state.teamTwoLogo : state.sideTwoPlayerOne.profilePhoto} />
            <span className="right-14 absolute top-1/2  transform -translate-y-1/2 text-white font-bold 360p:text-[2rem]  480p:text-[1rem] 720p:text-[5.5rem] 1080p:text-[1.8rem] 2k:text-[3.1rem] 4k:text-[5rem]">
              {/* {state.tournamentId && state.tournamentSubItem
                ? isTeamReveresed
                  ? state.tournamentSubItem?.tournamentItem.teamOneScore!
                  : state.tournamentSubItem?.tournamentItem.teamTwoScore!
                : state.teamTwoScore} */}
            </span>
          </div>

          <div className="h-[20%] pt-8">
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideTwoPlayerOne, state.sideTwoPlayerTwo]}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="h-[35%] w-full pt-4">
            <div className="flex flex-col gap-4 h-full">
              <TeamScore
                score={activeSet ? activeSet.teamTwoScore : 0}
                isActive={isTeamTwoActive}
                breakScore={activeTurn?.score}
              />
              <Player
                playerOneName={state.sideTwoPlayerOne.name}
                playerTwoName={state.sideTwoPlayerTwo ? state.sideTwoPlayerTwo.name : undefined}
                ballToShow={state.sport === 'BILLIARDS' && state.tournamentId === null ? 'WHITE' : null}
                isActive={isTeamTwoActive}
                handicap={state.teamTwoHandicap}
              />
            </div>
          </div>
        </div>

        <div className="absolute w-[28%] left-1/2 transform -translate-x-1/2 h-[30%] flex justify-center items-center gap-10">
          <ClubLogo venueNo={state.venueNo!} />
        </div>

        <div className="absolute h-[40%] top-[50%] left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col 360p:gap-1 480p:gap-2 720p:gap-2 1080p:gap-3 2k:gap-4 4k:gap-6 overflow-auto h-full justify-start items-center col-span-1">
            {state.tournamentSubItem && state.tournamentSubItem?.gameFormat.isCumulativeScoring ? (
              <></>
            ) : (
              <div className="bg-black p-2 2k:p-4 4k:p-6 border border-white rounded-xl flex flex-col justify-start items-center">
                {state.tournamentId && state.tournamentSubItem ? (
                  <PlayerScore
                    teamOneScore={state.teamOneScore}
                    teamTwoScore={state.teamTwoScore}
                    noOfFrames={
                      state.tournamentSubItem.gameFormat.noOfSets ? state.tournamentSubItem.gameFormat.noOfSets : 0
                    }
                  />
                ) : (
                  <>
                    <span className="text-center text-white 360p:text-[0.6rem] 480p:text-[1rem] 720p:text-[1.6rem] 1080p:text-[1.8rem] 2k:text-[4rem] 4k:text-[6rem]">
                      Time Left (mins):
                    </span>
                    <strong className="text-center text-white 360p:text-[2.2rem] 480p:text-[3.1rem] 720p:text-[5rem] 1080p:text-[5.4rem] 2k:text-[4.8rem] 4k:text-[6.8rem] leading-[1]">
                      {formatTime(timeLeft)}
                    </strong>
                    <span className="text-white font-bold uppercase 360p:text-[0.6rem]  480p:text-[1rem] 720p:text-[1.6rem] 1080p:text-[1.8rem] 2k:text-[3.1rem] 4k:text-[5rem]">
                      {state.format} {state.sport}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-[10%] flex gap-2 absolute w-[98%] left-1/2 transform -translate-x-1/2 top-[88%] rounded-md border border-white py-1 px-2 bg-black items-center">
          <img src="/images/clublogo.png" className="h-10 w-10 rounded-full overflow-hidden" />

          <div className="flex-grow text-center text-white font-bold 480p:text-[1.3rem] 720p:text-[1.8rem] 1080p:text-[2.8rem]  2k:text-[3rem] 4k:text-[4rem] uppercase">
            {state.tournamentId && state.tournamentSubItem
              ? `GAME #${state.tournamentSubItem.gameFormat.matchNo} | ${state.tournamentSubItem.gameFormat.name} | ${state.tournamentSubItem.tournamentItem.tournamentPhase.name}`
              : `PRACTICE | ${state.format} | ${state.clubName}`}
          </div>
        </div>
      </div>
    </section>
  );
}

// Player Image Component
function PlayerImage({ profilePhoto }: { profilePhoto?: string | null }) {
  return (
    <div className="flex justify-center items-center col-span-1 h-full overflow-auto">
      <img
        className="rounded-md overflow-hidden h-full w-auto aspect-square object-cover"
        src={profilePhoto ? profilePhoto : '/images/user-dummy-pic.jpg'}
      />
    </div>
  );
}

// Club Logo Component
function ClubLogo({ venueNo }: { venueNo: number }) {
  return (
    <div className="flex justify-center items-center bg-black rounded border border-white 360p:size-12 480p:size-36 720p:size-36">
      <span className="text-white font-bold uppercase 360p:text-[2rem]  480p:text-[1rem] 720p:text-[5.5rem] 1080p:text-[1.8rem] 2k:text-[3.1rem] 4k:text-[5rem]">
        T{venueNo}
      </span>
    </div>
    // <img src={src!} className="180p:w-4 360p:w-16 480p:w-20  720p:w-32 1080p:w-44 2k:w-56 4k:w-96 h-auto !important" />
  );
}

// Snooker Point Display Component
function SnookerPointDisplay({ turns, players }: { turns?: any[]; players: any[] }) {
  const activeTurnPointTypes = getSnookerPointTypesByTurns(
    turns?.filter((value) => players.some((player) => player && value.turnPlayerId === player.id)) || [],
  );

  return (
    <div className="flex justify-center items-start h-full">
      <div className="w-full">
        <SnookerPointTypeDisplay
          class={'360p:gap-[0.125rem] 480p:gap-1 720p:gap-1 1080p:gap-2 2k:gap-3 4k:gap-4'}
          className={
            ' 360p:text-[0.4rem] 360p:size-3  480p:text-[0.5rem] 720p:text-[1rem] 1080p:text-[1.3rem] 480p:h-3 480p:w-3  720p:h-5 720p:w-5 1080p:h-8 1080p:w-8 2k:h-10 2k:w-10 2k:text-[1.5rem] 4k:h-16 4k:w-16 4k:text-[2.2rem] flex justify-center'
          }
          activeTurnPointTypes={activeTurnPointTypes}
        />
      </div>
    </div>
  );
}

// Team Score Component
function TeamScore({ score, isActive, breakScore }: { score: number; isActive: boolean; breakScore?: number }) {
  return (
    <div className="flex flex-col gap-1 overflow-auto h-full justify-start items-center col-span-1">
      <span className=" 360p:text-[4rem] 480p:text-[4.4rem] 720p:text-[6rem] 1080p:text-[9rem] 2k:text-[10rem] text-white font-bold leading-[1] 4k:text-[18rem]">
        {score}
      </span>
      {isActive && (
        <span className="text-yellow-500 360p:text-[1rem] 480p:text-[1.2rem] 720p:text-[1.9rem] 1080p:text-[2.6rem]  2k:text-[3rem] 4k:text-[4rem] font-medium">
          BREAK {breakScore}
        </span>
      )}
    </div>
  );
}

// Player Score Component
function PlayerScore({
  teamOneScore,
  teamTwoScore,
  noOfFrames,
}: {
  teamOneScore: number;
  teamTwoScore: number;
  noOfFrames?: number;
}) {
  return (
    <div className="flex justify-center items-center col-span-4 p-3">
      <span className="480p:text-[2rem] 720p:text-[3rem] 1080p:text-[3.5rem]  2k:text-[3.8rem] 4k:text-[4.4rem] text-center text-white font-bold leading-[1]">
        {teamOneScore} {noOfFrames ? `(${noOfFrames})` : ''} {teamTwoScore}
      </span>
    </div>
  );
}

function Player({
  playerOneName,
  playerTwoName,
  ballToShow,
  isActive,
  handicap,
}: {
  playerOneName: string;
  playerTwoName?: string;
  ballToShow: 'YELLOW' | 'WHITE' | null;
  isActive: boolean;
  handicap?: number | null;
}) {
  return (
    <div
      className={clsx(
        'flex  mt-auto gap-4 w-full justify-center items-center  font-bold 360p:text-[1.5rem] 480p:text-[1.3rem] 720p:text-[1.8rem] 1080p:text-[2.8rem]  2k:text-[3rem] 4k:text-[4rem] uppercase',
        {
          'text-yellow-500': isActive,
          'text-white': !isActive,
        },
      )}
    >
      {ballToShow === 'YELLOW' && (
        <img
          className="360p:size-4 480p:size-6 720p:size-10 object-contain aspect-square"
          src={'/images/yellow-ball.png'}
        />
      )}
      {truncateText(generatePlayerName(playerOneName, playerTwoName))}
      {handicap && <span>({convertHandicapToString(handicap)})</span>}
      {ballToShow === 'WHITE' && (
        <img
          className="360p:size-4 480p:size-6 720p:size-10 object-contain aspect-square"
          src={'/images/white-ball.png'}
        />
      )}
    </div>
  );
}
