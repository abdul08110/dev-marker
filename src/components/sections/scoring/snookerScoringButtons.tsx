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

interface SnookerScoringProps {
    onButtonClick: (buttonType: SnookerScoringButtonEnum) => void;
}

export function SnookerScoringButtons(props: SnookerScoringProps) {
    const commonClasses = clsx(
        "rounded-lg p-1 border border-white text-center text-sm flex justify-center items-center"
    );

    return (
        <div className="w-full container flex flex-col gap-2 mt-auto">
            <div className="grid grid-cols-5 grid-rows-3 gap-2">
                <button
                    className={clsx("col-span-2 bg-markerButton", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.START_FRAME)}
                >
                    Start Frame
                </button>
                <button
                    className={clsx("col-span-1 bg-markerButton", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.END_GAME)}
                >
                    End Game
                </button>
                <button
                    className={clsx("col-span-1 bg-markerButton", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.END_FRAME)}
                >
                    End Frame
                </button>
                <button
                    className={clsx("col-span-1 bg-markerButton", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.UNDO_SCORE)}
                >
                    Undo Score
                </button>
                <button
                    className={clsx("col-span-1 bg-yellow-500 aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.YELLOW)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-1 bg-green-500 aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.GREEN)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-3 bg-red-500", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.RED)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-1 bg-markerButton", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.FOUL)}
                >
                    Foul
                </button>
                <button
                    className={clsx("col-span-1 bg-orange-500 aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BROWN)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-1 bg-blue-700 aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLUE)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-1 bg-pink-500 aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.PINK)}
                >
                    &nbsp;
                </button>
                <button
                    className={clsx("col-span-1 bg-black aspect-square", commonClasses)}
                    onClick={() => props.onButtonClick(SnookerScoringButtonEnum.BLACK)}
                >
                    &nbsp;
                </button>
            </div>
        </div>
    );
}