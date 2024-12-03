import clsx from 'clsx';

interface SnookerFramesSummaryProps {
  team1Score?: number;
  team2Score?: number;
  team1Handicap?: number;
  team2Handicap?: number;
  class?: string;
  componentClass?: string;
  // maxRounds: number;
}

export function SnookerFramesSummary(props: SnookerFramesSummaryProps) {
  return (
    <div className={clsx('w-full container', props.class)}>
      <div className={clsx('flex justify-between bg-black p-2 text-white', props.componentClass)}>
        {props.team1Handicap ? <span>({props.team1Handicap})</span> : <></>}
        {props.team1Score ? <span>({props.team1Score})</span> : <span>(0)</span>}

        {props.team2Handicap ? <span>({props.team2Handicap})</span> : <></>}

        {props.team2Score ? <span>({props.team2Score})</span> : <span>(0)</span>}
      </div>
    </div>
  );
}
