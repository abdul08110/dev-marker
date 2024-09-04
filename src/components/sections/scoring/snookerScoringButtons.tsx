import clsx from 'clsx';

export enum SnookerScoringButtonEnum {
    START_FRAME = "START_FRAME",
    END_GAME = "END_GAME",
    END_FRAME = "END_FRAME",
    UNDO_SCORE = "UNDO_SCORE",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    RED = "RED",
    FOUL = "FOUL",
    BROWN = "BROWN",
    BLUE = "BLUE",
    PINK = "PINK",
    BLACK = "BLACK",
}

interface SnookerScoringDisabledState {
    START_FRAME: boolean;
    UNDO_SCORE: boolean;
    END_FRAME: boolean;
    BLACK: boolean;
    BLUE: boolean;
    BROWN: boolean;
    GREEN: boolean;
    PINK: boolean;
    YELLOW: boolean;
    RED: boolean;
    END_GAME: boolean;
    FOUL: boolean;
}


interface SnookerScoringProps {
    onButtonClick: (buttonType: SnookerScoringButtonEnum) => void;
    disabledState: SnookerScoringDisabledState,
    isBreakOff: boolean
}

export function SnookerScoringButtons(props: SnookerScoringProps) {
    const commonClasses = clsx(
        "rounded-xl p-1 border-2 border-white text-center text-sm flex justify-center items-center disabled:opacity-50 active:opacity-50"
    );

    const buttonShineClass = clsx("absolute top-[10%] bg-gradient-to-b from-white h-[35%] w-[90%] rounded-md opacity-50");

    return (
        <div className="w-full container flex flex-col gap-2 mt-auto">
            <div className="grid grid-cols-5 grid-rows-3 gap-2">
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.END_GAME]}
                    className={clsx("col-span-1 bg-markerButton relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.END_GAME)}
                >
                    End Game
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.END_FRAME]}
                    className={clsx("col-span-1 bg-markerButton relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.END_FRAME)}
                >
                    End Frame
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.UNDO_SCORE]}
                    className={clsx("col-span-1 bg-markerButton relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.UNDO_SCORE)}
                >
                    Undo
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.START_FRAME]}
                    className={clsx("col-span-2 bg-markerButton relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.START_FRAME)}
                >
                    { props.isBreakOff ? 'Break Off' : 'Start Frame' }
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.YELLOW]}
                    className={clsx("col-span-1 bg-[#FEF954] aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.YELLOW)}
                >
                    <div className={clsx(buttonShineClass)}></div>
             
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.GREEN]}
                    className={clsx("col-span-1 bg-[#78F44B] aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.GREEN)}
                >
                    <div className={clsx(buttonShineClass)}></div>
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.RED]}
                    className={clsx("col-span-3 bg-[#E93323] relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.RED)}
                >
                   <div className={clsx(buttonShineClass)}></div>
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.FOUL]}
                    className={clsx("col-span-1 bg-markerButton relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.FOUL)}
                >
                    Foul
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.BROWN]}
                    className={clsx("col-span-1 bg-[#AD5B2D] aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BROWN)}
                >
                    <div className={clsx(buttonShineClass)}></div>
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.BLUE]}
                    className={clsx("col-span-1 bg-[#0000F4] aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLUE)}
                >
                    <div className={clsx(buttonShineClass)}></div>
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.PINK]}
                    className={clsx("col-span-1 bg-[#BE6B89] aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.PINK)}
                >
                    <div className={clsx(buttonShineClass)}></div>
                </button>
                <button
                    disabled={props.disabledState[SnookerScoringButtonEnum.BLACK]}
                    className={clsx("col-span-1 bg-black aspect-square relative", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLACK)}
                >
                   <div className={clsx(buttonShineClass)}></div>
                </button>
            </div>
        </div>
    );
}