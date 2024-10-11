import { ScoreBoardState } from '@/hooks/useScoreboard';
import clsx from 'clsx';
import { ScoreBoardTeamCard } from './scoreBoardTeamCard';

interface ScoreBoardRenderProps {
  state: ScoreBoardState;
  orientation: string;
}

export function ScoreboardRender(props: ScoreBoardRenderProps) {
  return (
    <div className="container flex-grow">
      <div
        className={clsx('w-full h-full grid gap-5', {
          'grid-rows-2 grid-cols-1': props.orientation === 'portrait',
          'grid-rows-1 grid-cols-2': props.orientation === 'landscape',
        })}
      >
        <ScoreBoardTeamCard
          playerOne={props.state.sideOnePlayerOne}
          playerTwo={props.state.sideOnePlayerTwo}
          score={props.state.currentSetTeamOneScore}
          break={props.state.activePlayerTurnScore}
          activePlayerId={props.state.activePlayerId}
        />
        <ScoreBoardTeamCard
          playerOne={props.state.sideTwoPlayerOne}
          playerTwo={props.state.sideTwoPlayerTwo}
          score={props.state.currentSetTeamTwoScore}
          break={props.state.activePlayerTurnScore}
          activePlayerId={props.state.activePlayerId}
        />
      </div>
    </div>
  );
}
