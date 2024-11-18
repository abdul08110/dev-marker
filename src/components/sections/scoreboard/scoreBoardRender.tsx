import { ScoreBoardState } from '@/hooks/useScoreboard';
import clsx from 'clsx';
import { ScoreBoardTeamCard } from './scoreBoardTeamCard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { formatTime } from '@/utils/functions';

interface ScoreBoardRenderProps {
  state: ScoreBoardState;
  orientation: 'landscape' | 'portrait';
  timeLeft: number;
}

export function ScoreboardRender(props: ScoreBoardRenderProps) {
  const activeSet = getActiveSet(props.state.sets);
  const activeTurn = getActiveTurn(activeSet);
  const teamOneTurns = activeSet?.turns.filter(
    (value) =>
      value.turnPlayerId === props.state.sideOnePlayerOne.id ||
      (props.state.sideOnePlayerTwo !== null && value.turnPlayerId === props.state.sideOnePlayerTwo?.id),
  );
  const teamTwoTurns = activeSet?.turns.filter(
    (value) =>
      value.turnPlayerId === props.state.sideTwoPlayerOne.id ||
      (props.state.sideTwoPlayerTwo !== null && value.turnPlayerId === props.state.sideTwoPlayerTwo?.id),
  );

  return (
    <div className="w-screen h-screen relative p-2">
      {props.state.expectedEndTimeDate ? (
        <div
          className={clsx('absolute  left-1/2 transform -translate-x-1/2  z-40 flex justify-center items-center', {
            '-rotate-90 bottom-24': props.orientation === 'portrait',
            'top-1/2 -translate-y-1/2': props.orientation === 'landscape',
          })}
        >
          <div className="bg-[#2D2D2D] p-2 border border-white rounded-xl flex flex-col justify-center items-center">
            <span className="text-center text-white md:text-xl text-base">Time Left (mins):</span>
            <strong className="text-center text-white md:text-8xl text-4xl leading-[1]">
              {formatTime(props.timeLeft)}
            </strong>
          </div>
        </div>
      ) : (
        <></>
      )}

      {props.state.tournamentId !== null && props.state.sport === 'BILLIARDS' ? (
        <div
          className={clsx('absolute  left-1/2 transform -translate-x-1/2  z-40 flex justify-center items-center', {
            '-rotate-90 bottom-24': props.orientation === 'portrait',
            'top-40 -translate-y-1/2': props.orientation === 'landscape',
          })}
        >
          <div className="bg-[#2D2D2D] p-2 border border-white rounded-xl flex flex-col justify-center items-center">
            <strong
              className={clsx('text-center text-white leading-[1]', {
                'text-6xl': props.orientation === 'landscape',
                'md:text-6xl text-2xl flex flex-col': props.orientation === 'portrait',
              })}
            >
              <span>{props.state.maxScorePerSet} UP</span>
            </strong>
          </div>
        </div>
      ) : (
        <></>
      )}

      {props.state.tournamentId === null ? (
        <div
          className={clsx(
            'absolute left-1/2 transform -translate-x-1/2 top-[12%] z-40 flex justify-center items-center',
            {
              '-rotate-90 -top-14': props.orientation === 'portrait',
              'top-[12%]': props.orientation === 'landscape',
            },
          )}
        >
          <div className="bg-[#2D2D2D] p-2 border border-white rounded-xl flex flex-col justify-center items-center">
            <strong
              className={clsx('text-center text-white leading-[1]', {
                'text-4xl': props.orientation === 'landscape',
                'md:text-6xl text-2xl flex flex-col': props.orientation === 'portrait',
              })}
            >
              <span>{props.state.teamOneScore}</span> <span>({props.state.sets.length})</span>{' '}
              <span>{props.state.teamTwoScore}</span>
            </strong>
          </div>
        </div>
      ) : (
        <></>
      )}

      {props.state.tournamentId !== null ? (
        <div
          className={clsx(
            'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex justify-center items-center',
            {
              '-rotate-90': props.orientation === 'portrait',
              '': props.orientation === 'landscape',
            },
          )}
        >
          {props.state.sport === 'BILLIARDS' ? (
            <></>
          ) : (
            <div className="bg-[#2D2D2D] p-2 border border-white rounded-xl flex flex-col justify-center items-center">
              <strong
                className={clsx('text-center text-white leading-[1]', {
                  'text-4xl': props.orientation === 'landscape',
                  'md:text-6xl text-2xl flex flex-col': props.orientation === 'portrait',
                })}
              >
                <span>{props.state.tournamentTeamOneScore ? props.state.tournamentTeamOneScore : 0}</span>{' '}
                <span>(3)</span>{' '}
                <span>{props.state.tournamentTeamTwoScore ? props.state.tournamentTeamTwoScore : 0}</span>
              </strong>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      {/* {props.state.tournamentId !== null ? (
        <div
          className={clsx('absolute right-10 top-10 z-10 bg-[#2D2D2D] p-2 border-white border', {
            '-rotate-90 -top-14': props.orientation === 'portrait',
            'top-[12%]': props.orientation === 'landscape',
          })}
        >
          {
            <strong
              className={clsx('text-center text-white leading-[1]', {
                'text-4xl': props.orientation === 'landscape',
                'md:text-6xl text-2xl flex flex-col': props.orientation === 'portrait',
              })}
            >
              {props.state.tournamentTeamOneScore}
            </strong>
          }
        </div>
      ) : (
        <></>
      )} */}

      <div className={clsx('w-full h-full gap-2 grid grid-cols-2')}>
        <ScoreBoardTeamCard
          contentfrom={props.orientation === 'portrait' ? 'left' : 'top'}
          playerOne={props.state.sideOnePlayerOne}
          playerTwo={props.state.sideOnePlayerTwo}
          score={activeSet ? activeSet.teamOneScore : 0}
          activeTurn={activeTurn}
          activePlayerId={props.state.activePlayerId}
          showBilliardsBall={props.state.sport === 'BILLIARDS' ? 'YELLOW' : null}
          sport={props.state.sport}
          teamIndex={0}
          tournamentTeamLogo={props.state.teamOneLogo}
          tournamentId={props.state.tournamentId}
          teamHandicap={props.state.teamOneHandicap}
          teamTurns={teamOneTurns ? teamOneTurns : null}
          isHandicapApplied={props.state.isTeamOneHandicapApplied}
          tournamentTeamName={props.state.tournamentTeamOneName}
        />
        <ScoreBoardTeamCard
          contentfrom={props.orientation === 'portrait' ? 'left' : 'top'}
          playerOne={props.state.sideTwoPlayerOne}
          playerTwo={props.state.sideTwoPlayerTwo}
          score={activeSet ? activeSet.teamTwoScore : 0}
          activeTurn={activeTurn}
          activePlayerId={props.state.activePlayerId}
          showBilliardsBall={props.state.sport === 'BILLIARDS' ? 'WHITE' : null}
          sport={props.state.sport}
          teamIndex={1}
          tournamentTeamLogo={props.state.teamTwoLogo}
          tournamentId={props.state.tournamentId}
          teamHandicap={props.state.teamTwoHandicap}
          teamTurns={teamTwoTurns ? teamTwoTurns : null}
          isHandicapApplied={props.state.isTeamTwoHandicapApplied}
          tournamentTeamName={props.state.tournamentTeamTwoName}
        />
      </div>
    </div>
  );
}
