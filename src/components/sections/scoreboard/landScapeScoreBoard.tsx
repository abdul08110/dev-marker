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
  const isTeamOneActive =
    state.sideOnePlayerOne?.id === state.activePlayerId || state.sideOnePlayerTwo?.id === state.activePlayerId;
  const isTeamTwoActive =
    state.sideTwoPlayerOne?.id === state.activePlayerId || state.sideTwoPlayerTwo?.id === state.activePlayerId;
  const isTeamReveresed =
    state.tournamentId && state.tournamentSubItem
      ? state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== state.tournamentTeamOneId
      : false;

  return (
    <section className="h-screen w-screen p-[min(2vh,2vw)]">
      <div className="relative h-full w-full grid grid-cols-2 gap-[min(3vh,3vw)]">
        <div
          className={clsx('col-span-1 p-[min(4vh,4vw)] h-full overflow-auto rounded-md', {
            'bg-[#5E5E5E]': !isTeamOneActive,
            'bg-primary': isTeamOneActive,
          })}
        >
          <div className="h-[25%] w-full relative">
            <span className="ml-[min(3vh,3vw)] absolute top-1/2 transform -translate-y-1/2 text-white font-bold text-[min(6vh,6vw)]">
              {state.tournamentId && state.tournamentSubItem
                ? isTeamReveresed
                  ? state.tournamentSubItem?.tournamentItem.teamTwoScore!
                  : state.tournamentSubItem?.tournamentItem.teamOneScore!
                : state.teamOneScore}
            </span>
            <PlayerImage profilePhoto={state.tournamentId ? state.teamOneLogo : state.sideOnePlayerOne.profilePhoto} />
          </div>

          <div className="h-[15%] pt-[min(2vh,2vw)]">
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideOnePlayerOne, state.sideOnePlayerTwo]}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="h-[45%] w-full pt-[min(2vh,2vw)]">
            <div className="flex flex-col gap-[min(2vh,2vw)] h-full">
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
          className={clsx('col-span-1 p-[min(4vh,4vw)] h-full overflow-auto rounded-md', {
            'bg-[#5E5E5E]': !isTeamTwoActive,
            'bg-primary': isTeamTwoActive,
          })}
        >
          <div className="h-[25%] w-full relative">
            <PlayerImage profilePhoto={state.tournamentId ? state.teamTwoLogo : state.sideTwoPlayerOne.profilePhoto} />
            <span className="right-[min(3vh,3vw)] absolute top-1/2 transform -translate-y-1/2 text-white font-bold text-[min(6vh,6vw)]">
              {state.tournamentId && state.tournamentSubItem
                ? isTeamReveresed
                  ? state.tournamentSubItem?.tournamentItem.teamOneScore!
                  : state.tournamentSubItem?.tournamentItem.teamTwoScore!
                : state.teamTwoScore}
            </span>
          </div>

          <div className="h-[15%] pt-[min(2vh,2vw)]">
            {state.sport === 'SNOOKER' ? (
              <SnookerPointDisplay
                turns={activeSet?.turns}
                players={[state.sideTwoPlayerOne, state.sideTwoPlayerTwo]}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="h-[45%] w-full pt-[min(2vh,2vw)]">
            <div className="flex flex-col gap-[min(2vh,2vw)] h-full">
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

        <div className="absolute w-[28%] left-1/2 transform -translate-x-1/2 h-[30%] flex justify-center items-center gap-[min(3vh,3vw)]">
          <ClubLogo venueNo={state.venueNo!} />
        </div>

        <div className="absolute h-[40%] top-[50%] left-1/2 transform -translate-x-1/2 w-auto">
          <div className="flex flex-col gap-[min(2vh,2vw)] overflow-auto h-full justify-start items-center">
            {state.tournamentSubItem && state.tournamentSubItem?.gameFormat.isCumulativeScoring ? (
              <></>
            ) : (
              <>
                {state.tournamentId && state.tournamentSubItem ? (
                  state.tournamentSubItem.gameFormat.noOfSets && state.tournamentSubItem.gameFormat.noOfSets > 1 ? (
                    <div className="bg-black p-[min(2vh,2vw)] border border-white rounded-xl flex flex-col justify-start items-center">
                      <PlayerScore
                        teamOneScore={state.teamOneScore}
                        teamTwoScore={state.teamTwoScore}
                        noOfFrames={
                          state.tournamentSubItem.gameFormat.noOfSets ? state.tournamentSubItem.gameFormat.noOfSets : 0
                        }
                      />
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <div className="bg-black p-[min(2vh,2vw)] border border-white rounded-xl flex flex-col justify-start items-center">
                    <span className="text-center text-white text-[min(3vh,3vw)]">Time Left (mins):</span>
                    <strong className="text-center text-white text-[min(8vh,8vw)] leading-[1]">
                      {formatTime(timeLeft)}
                    </strong>
                    <span className="text-white font-bold uppercase text-[min(3vh,3vw)]">
                      {state.format} {state.sport}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="h-[10%] flex gap-[min(1vh,1vw)] absolute w-[98%] left-1/2 transform -translate-x-1/2 top-[88%] rounded-md border border-white py-[min(0.5vh,0.5vw)] px-[min(1vh,1vw)] bg-black items-center">
          <img src="/images/clublogo.png" className="h-[min(5vh,5vw)] w-[min(5vh,5vw)] rounded-full overflow-hidden" />

          <div className="flex-grow text-center text-white font-bold text-[min(3vh,3vw)] uppercase">
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
    <div className="flex justify-center items-center h-full w-full">
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
    <div className="flex justify-center items-center bg-black rounded border border-white size-[min(15vh,15vw)]">
      <span className="text-white font-bold uppercase text-[min(6vh,6vw)]">T{venueNo}</span>
    </div>
  );
}

// Snooker Point Display Component
function SnookerPointDisplay({ turns, players }: { turns?: any[]; players: any[] }) {
  const activeTurnPointTypes = getSnookerPointTypesByTurns(
    turns?.filter((value) => players.some((player) => player && value.turnPlayerId === player.id)) || [],
  );

  return (
    <div className="flex justify-center items-start h-full">
      <div className="w-full h-full">
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
    <div className="flex flex-col gap-[min(1vh,1vw)] overflow-auto h-full justify-start items-center col-span-1">
      <span className="text-white font-bold text-[min(20vh,20vw)] leading-none">{score}</span>
      {isActive && <span className="text-yellow-500 font-bold text-[min(5vh,5vw)]">BREAK {breakScore}</span>}
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
    <div className="flex justify-center items-center p-[min(1.5vh,1.5vw)]">
      <span className="text-white font-bold text-[min(10vh,10vw)] leading-none whitespace-nowrap">
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
        'flex mt-auto mb-[min(2vh,2vw)] gap-[min(2vh,2vw)] w-full justify-center items-center font-bold text-[min(3.5vh,3.5vw)] uppercase',
        {
          'text-yellow-500': isActive,
          'text-white': !isActive,
        },
      )}
    >
      {ballToShow === 'YELLOW' && (
        <img className="size-[min(3vh,3vw)] object-contain aspect-square" src={'/images/yellow-ball.png'} />
      )}
      {truncateText(generatePlayerName(playerOneName, playerTwoName))}
      {handicap && <span>({convertHandicapToString(handicap)})</span>}
      {ballToShow === 'WHITE' && (
        <img className="size-[min(3vh,3vw)] object-contain aspect-square" src={'/images/white-ball.png'} />
      )}
    </div>
  );
}
