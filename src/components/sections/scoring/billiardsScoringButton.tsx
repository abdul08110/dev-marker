import clsx from 'clsx';

export enum BilliardsScoringButtonEnum {
  RED_IN_OFF = 'RED_IN_OFF',
  RED_POT = 'RED_POT',
  WHITE_IN_OFF = 'WHITE_IN_OFF',
  WHITE_POT = 'WHITE_POT',
  CANNON = 'CANNON',
  FOUL = 'FOUL',
  BREAK_OFF = 'BREAK_OFF',
}

interface BilliardsScoringProps {
  onButtonClick: (buttonType: BilliardsScoringButtonEnum) => void;
  showBreakOff: boolean;
  enableScoringButtons: boolean;
  handleSwitchPlayer: () => void;
  enableSwitchPlayer?: boolean;
}

export function BilliardsScoringButtons(props: BilliardsScoringProps) {
  const commonClasses = clsx(
    'rounded-xl p-1 border-2 border-white text-center text-sm flex justify-center items-center disabled:opacity-50 active:opacity-50',
  );

  const buttonShineClass = clsx('absolute top-[10%] bg-gradient-to-b from-white h-[35%] w-[90%] rounded-md opacity-50');

  return (
    <div className="w-full container flex flex-col gap-2 mt-auto">
      <div className="grid grid-cols-8 grid-rows-2 gap-2">
        {props.showBreakOff ? (
          <button
            className={clsx('col-span-2 row-span-2 bg-markerButton relative h-44', commonClasses)}
            onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.BREAK_OFF)}
          >
            Break Off
          </button>
        ) : (
          <button
            disabled={!props.enableScoringButtons}
            className={clsx('col-span-2 row-span-2 bg-markerButton relative h-44', commonClasses)}
            onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.FOUL)}
          >
            Foul
          </button>
        )}
        <button
          disabled={!props.enableScoringButtons}
          className={clsx('col-span-2 row-span-1 bg-red-500 text-white relative', commonClasses)}
          onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.RED_IN_OFF)}
        >
          <div className={clsx(buttonShineClass)}></div>
          Red In-Off
        </button>
        <button
          disabled={!props.enableScoringButtons}
          className={clsx('col-span-2 row-span-1  bg-red-500 text-white relative', commonClasses)}
          onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.RED_POT)}
        >
          <div className={clsx(buttonShineClass)}></div>
          Red Pot
        </button>
        <button
          disabled={!props.enableScoringButtons}
          className={clsx('col-span-2 row-span-2 bg-white relative', commonClasses)}
          onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.CANNON)}
        >
          Cannon
        </button>
        <button
          disabled={!props.enableScoringButtons}
          className={clsx('col-span-2 row-span-1 bg-white relative', commonClasses)}
          onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.WHITE_IN_OFF)}
        >
          White In-Off
        </button>
        <button
          disabled={!props.enableScoringButtons}
          className={clsx('col-span-2 row-span-1 relative bg-white', commonClasses)}
          onClick={() => props.onButtonClick(BilliardsScoringButtonEnum.WHITE_POT)}
        >
          White Pot
        </button>
        <button
          disabled={!props.enableSwitchPlayer}
          className={clsx('col-span-8 h-14 row-span-1 bg-white relative', commonClasses)}
          onClick={props.handleSwitchPlayer}
        >
          Switch Player
        </button>
      </div>
    </div>
  );
}
