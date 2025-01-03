import { ScoreBoardState } from '@/hooks/useScoreboard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { formatTime } from '@/utils/functions';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';

interface LandscapeScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

export function LandscapeScoreboard({ state, timeLeft }: LandscapeScoreBoardProps) {
  const activeSet = getActiveSet(state.sets);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = state.sideOnePlayerOne.id === state.activePlayerId;
  const isTeamTwoActive = state.sideTwoPlayerOne.id === state.activePlayerId;

  return (
    <section className="h-screen w-screen bg-gradient-to-b from-[#21062C] to-black flex flex-col 480p:p-5 720p:p-5 1080p:p-8 2k:p-12 4k:p-16">
      {/* Player and Club Images */}
      <div className="h-[30%] w-full grid grid-cols-3">
        <PlayerImage player={state.sideOnePlayerOne} />
        <ClubLogo src={state.clubLogo!} />
        <PlayerImage player={state.sideTwoPlayerOne} />
      </div>

      {/* Snooker Point Types */}
      <div className="h-[20%] w-full grid grid-cols-3 pt-8 2xl:pt-14">
        <SnookerPointDisplay turns={activeSet?.turns} players={[state.sideOnePlayerOne, state.sideOnePlayerTwo]} />
        <div className="flex justify-center items-center h-full"></div>
        <SnookerPointDisplay turns={activeSet?.turns} players={[state.sideTwoPlayerOne, state.sideTwoPlayerTwo]} />
      </div>

      {/* Team Scores */}
      <div className="h-[30%] w-full grid grid-cols-3 pt-8">
        <TeamScore
          score={activeSet ? activeSet.teamOneScore : 0}
          isActive={isTeamOneActive}
          breakScore={activeTurn?.score}
        />
        <div className="flex flex-col 480p:gap-2 720p:gap-2 1080p:gap-3 2k:gap-4 4k:gap-6 overflow-auto h-full justify-start items-center col-span-1">
          <div className="bg-black p-2 2k:p-4 4k:p-6 border border-white rounded-xl flex flex-col justify-start items-center">
            <span className="text-center text-white 480p:text-[0.6rem] 720p:text-[1.2rem] 1080p:text-[1.8rem] 2k:text-[4rem] 4k:text-[6rem]">
              Time Left (mins):
            </span>
            <strong className="text-center text-white 480p:text-[1.8rem] 720p:text-[3.3rem] 1080p:text-[5.4rem] 2k:text-[4.8rem] 4k:text-[6.8rem] leading-[1]">
              {formatTime(timeLeft)}
            </strong>
          </div>
          <span className="text-white font-bold uppercase  480p:text-[0.6rem] 720p:text-[1.2rem] 1080p:text-[1.8rem] 2k:text-[3.1rem] 4k:text-[5rem]">
            {state.format} {state.sport}
          </span>
        </div>
        <TeamScore
          score={activeSet ? activeSet.teamTwoScore : 0}
          isActive={isTeamTwoActive}
          breakScore={activeTurn?.score}
        />
      </div>

      {/* Player Scores */}
      <div className="h-[10%] w-full rounded-md border border-white grid grid-cols-12 py-1 bg-black">
        <Player playerOneName={state.sideOnePlayerOne.name} />
        <PlayerScore teamOneScore={state.teamOneScore} teamTwoScore={state.teamTwoScore} />
        <Player playerOneName={state.sideTwoPlayerOne.name} />
      </div>

      {/* Footer */}
      <FooterLogo />
    </section>
  );
}

// Player Image Component
function PlayerImage({ player }: { player: { profilePhoto?: string | null } }) {
  return (
    <div className="flex justify-center items-center col-span-1 h-full overflow-auto">
      <img
        className="rounded-md overflow-hidden h-full w-auto aspect-square border-primary border-2 object-cover"
        src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
      />
    </div>
  );
}

// Club Logo Component
function ClubLogo({ src }: { src: string | undefined }) {
  return (
    <div className="col-span-1 flex items-center justify-center overflow-auto">
      <img src={src!} className="480p:w-14  720p:w-24 1080p:w-44 2k:w-56 4k:w-96 h-auto !important" />
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
      <div className="w-full">
        <SnookerPointTypeDisplay
          class={'480p:gap-1 720p:gap-1 1080p:gap-2 2k:gap-3 4k:gap-4'}
          className={
            '480p:text-[0.5rem] 720p:text-[1rem] 1080p:text-[1.3rem] 480p:h-3 480p:w-3  720p:h-5 720p:w-5 1080p:h-8 1080p:w-8 2k:h-10 2k:w-10 2k:text-[1.5rem] 4k:h-16 4k:w-16 4k:text-[2.2rem] flex justify-center'
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
      <span className="480p:text-[3.2rem] 720p:text-[5.5rem] 1080p:text-[9rem] 2k:text-[10rem] text-white font-bold leading-[1] 4k:text-[18rem]">
        {score}
      </span>
      {isActive && (
        <span className="text-yellow-500 480p:text-[1rem] 720p:text-[1.4rem] 1080p:text-[2.6rem]  2k:text-[3rem] 4k:text-[4rem] font-medium">
          BREAK {breakScore}
        </span>
      )}
    </div>
  );
}

// Player Score Component
function PlayerScore({ teamOneScore, teamTwoScore }: { teamOneScore: number; teamTwoScore: number }) {
  return (
    <div className="flex justify-center items-center col-span-4">
      <span className="480p:text-[1.3rem] 720p:text-[1.8rem] 1080p:text-[2.8rem]  2k:text-[3rem] 4k:text-[4rem] text-center text-white font-bold leading-[1]">
        {teamOneScore} (3) {teamTwoScore}
      </span>
    </div>
  );
}

function Player({ playerOneName }: { playerOneName: string }) {
  return (
    <div className="col-span-4 flex justify-center items-center text-white font-bold 480p:text-[1.3rem] 720p:text-[1.8rem] 1080p:text-[2.8rem]  2k:text-[3rem] 4k:text-[4rem] uppercase">
      {playerOneName}
    </div>
  );
}

// Footer Logo Component
function FooterLogo() {
  return (
    <div className="h-[10%] 480p:py-2 720p:py-4 1080p:py-4 2k:py-6 4k:py-8 flex justify-center items-center">
      <img src="/images/clubliv-final-logo.png" className="w-auto h-full" />
    </div>
  );
}
