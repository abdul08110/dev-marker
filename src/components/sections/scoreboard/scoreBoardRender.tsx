import { ScoreBoardState } from '@/hooks/useScoreboard';
import clsx from 'clsx';
import { ScoreBoardTeamCard } from './scoreBoardTeamCard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { SnookerFramesSummary } from '../scoring/snookerFrameSummary';
import TimeManager from '../scoring/timeManager';

interface ScoreBoardRenderProps {
  state: ScoreBoardState;
  orientation: 'landscape' | 'portrait';
  timeLeft: number;
}

export function ScoreboardRender(props: ScoreBoardRenderProps) {
  const activeSet = getActiveSet(props.state.sets);
  const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="container flex-grow flex flex-col gap-4 relative">
      <TimeManager
        timeLeft={props.timeLeft}
        componentClass="bg-transparent"
        size={'large'}
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      />
      <SnookerFramesSummary
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex justify-center items-center"
        team1Score={props.state.teamOneScore}
        team2Score={props.state.teamTwoScore}
        componentClass="w-[80%]"
      />
      <div
        className={clsx('w-full h-full gap-20', {
          'grid gird-cols-1': props.orientation === 'portrait',
          'grid grid-cols-2': props.orientation === 'landscape',
        })}
      >
        <ScoreBoardTeamCard
          orientation={props.orientation}
          playerOne={props.state.sideOnePlayerOne}
          playerTwo={props.state.sideOnePlayerTwo}
          score={activeSet ? activeSet.teamOneScore : 0}
          activeTurn={activeTurn}
          activePlayerId={props.state.activePlayerId}
          showBilliardsBall={props.state.sport === 'BILLIARDS' ? 'YELLOW' : null}
          sport={props.state.sport}
        />

        

        <ScoreBoardTeamCard
          orientation={props.orientation}
          playerOne={props.state.sideTwoPlayerOne}
          playerTwo={props.state.sideTwoPlayerTwo}
          score={activeSet ? activeSet.teamTwoScore : 0}
          activeTurn={activeTurn}
          activePlayerId={props.state.activePlayerId}
          showBilliardsBall={props.state.sport === 'BILLIARDS' ? 'WHITE' : null}
          sport={props.state.sport}
        />
      </div>
    </div>
  );
}
