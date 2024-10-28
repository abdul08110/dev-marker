import clsx from 'clsx';

interface SnookerFramesSummaryProps {
  team1Score: number;
  team2Score: number;
  class?: string;
  componentClass?: string;
  // maxRounds: number;
}

export function SnookerFramesSummary(props: SnookerFramesSummaryProps) {
  return (
    <div className={clsx('w-full container', props.class)}>
      <div className={clsx('flex justify-between bg-black p-2 text-white', props.componentClass)}>
        <span>({props.team1Score})</span>
        {/* <span>({props.maxRounds})</span> */}
        <span>({props.team2Score})</span>
      </div>
    </div>
  );
}
