import ScaleLogo from '@/icons/scale';
import clsx from 'clsx';

export enum SnookerScoringButtonEnum {
  BREAK_OFF = 'BREAK_OFF',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  RED = 'RED',
  FOUL = 'FOUL',
  BROWN = 'BROWN',
  BLUE = 'BLUE',
  PINK = 'PINK',
  BLACK = 'BLACK',
  PLAY_SAFE = 'PLAY_SAFE',
  MISSED_POT = 'MISSED_POT',
  LONG_SHOT = 'LONG_SHOT',
}

interface SnookerScoringDisabledState {
  BREAK_OFF: boolean;
  BLACK: boolean;
  BLUE: boolean;
  BROWN: boolean;
  GREEN: boolean;
  PINK: boolean;
  YELLOW: boolean;
  RED: boolean;
  FOUL: boolean;
  PLAY_SAFE: boolean;
  MISSED_POT: boolean;
  LONG_SHOT: boolean;
}

interface SnookerScoringProps {
  onButtonClick: (buttonType: SnookerScoringButtonEnum) => void;
  disabledState: SnookerScoringDisabledState;
  isBreakOff: boolean;
  isLongEnabled: boolean;
  onLongClick: () => void;
}

export function SnookerScoringButtons(props: SnookerScoringProps) {
  const commonClasses = clsx(
    'rounded-xl p-1 border-2 border-white text-center text-sm flex justify-center items-center disabled:opacity-50 active:opacity-50',
  );

  const buttonShineClass = clsx('absolute top-[10%] bg-gradient-to-b from-white h-[35%] w-[90%] rounded-md opacity-50');

  return (
    <div className="w-full container flex flex-col gap-2 mt-auto">
      <div className="flex justify-end">
        <button
          onClick={() => props.onLongClick()}
          disabled={props.disabledState[SnookerScoringButtonEnum.LONG_SHOT]}
          className={clsx(
            'relative p-0 disabled:opacity-20 active:opacity-50 outline-0 border-0 flex justify-center items-center bg-transparent',
            {
              'opacity-20': props.isLongEnabled === false,
            },
          )}
        >
          <ScaleLogo className="w-32 h-auto text-white" />
          <small className="bg-black p-1 text-center absolute text-white text-xs">LONG</small>
        </button>
      </div>
      <div className="grid grid-cols-5 grid-rows-2 gap-2">
        {props.isBreakOff ? (
          <button
            disabled={props.disabledState[SnookerScoringButtonEnum.BREAK_OFF]}
            className={clsx('col-span-2 bg-markerButton relative', commonClasses)}
            onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BREAK_OFF)}
          >
            Break Off
          </button>
        ) : (
          <div className="col-span-2 grid grid-cols-2 gap-2 ">
            <button
              disabled={props.disabledState[SnookerScoringButtonEnum.PLAY_SAFE]}
              className={clsx(' bg-markerButton relative', commonClasses)}
              onClick={() => props.onButtonClick(SnookerScoringButtonEnum.PLAY_SAFE)}
            >
              Play Safe
            </button>
            <button
              disabled={props.disabledState[SnookerScoringButtonEnum.MISSED_POT]}
              className={clsx(' bg-markerButton relative', commonClasses)}
              onClick={() => props.onButtonClick(SnookerScoringButtonEnum.MISSED_POT)}
            >
              Missed Pot
            </button>
          </div>
        )}

        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.RED]}
          className={clsx('col-span-1 bg-[#E93323] relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.RED)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.YELLOW]}
          className={clsx('col-span-1 bg-[#FEF954] aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.YELLOW)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.GREEN]}
          className={clsx('col-span-1 bg-[#78F44B] aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.GREEN)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>

        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.FOUL]}
          className={clsx('col-span-1 bg-markerButton relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.FOUL)}
        >
          Foul
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.BROWN]}
          className={clsx('col-span-1 bg-[#AD5B2D] aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BROWN)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.BLUE]}
          className={clsx('col-span-1 bg-[#0000F4] aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLUE)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.PINK]}
          className={clsx('col-span-1 bg-[#BE6B89] aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.PINK)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
        <button
          disabled={props.disabledState[SnookerScoringButtonEnum.BLACK]}
          className={clsx('col-span-1 bg-black aspect-square relative', commonClasses)}
          onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLACK)}
        >
          <div className={clsx(buttonShineClass)}></div>
        </button>
      </div>
    </div>
  );
}
