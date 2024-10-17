import { ScoreBoardState } from '@/hooks/useScoreboard';
import clsx from 'clsx';
import { ScoreBoardTeamCard } from './scoreBoardTeamCard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { SnookerFramesSummary } from '../scoring/snookerFrameSummary';

interface ScoreBoardRenderProps {
  state: ScoreBoardState;
  orientation: string;
}

export function ScoreboardRender(props: ScoreBoardRenderProps) {
  const activeSet = getActiveSet(props.state.sets);
  const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="container flex-grow flex flex-col gap-4">
      <SnookerFramesSummary team1Score={props.state.teamOneScore} team2Score={props.state.teamTwoScore} />
      <div
        className={clsx('w-full h-full gap-5', {
          'grid gird-cols-1': props.orientation === 'portrait',
          'grid grid-cols-2': props.orientation === 'landscape',
        })}
      >
        <ScoreBoardTeamCard
          playerOne={props.state.sideOnePlayerOne}
          playerTwo={props.state.sideOnePlayerTwo}
          score={activeSet ? activeSet.teamOneScore : 0}
          activeTurn={activeTurn}
          activePlayerId={props.state.activePlayerId}
          showBilliardsBall={props.state.sport === 'BILLIARDS' ? 'YELLOW' : null}
          sport={props.state.sport}
        />
      
        <ScoreBoardTeamCard
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
