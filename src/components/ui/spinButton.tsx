import clsx from "clsx";
import { Button } from "./button";

interface SpinButtonProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function SpinButton({ value, onChange, min = 0, max = 100, step = 1 }: SpinButtonProps) {
    const increment = () => {
        if (value + step <= max) {
            onChange(value + step);
        }
    };

    const decrement = () => {
        if (value - step >= min) {
            onChange(value - step);
        }
    };

    return (
        <div className="flex items-center bg-gray-300 rounded-lg p-1">
            <Button
                variant={'default'}
                className={clsx(
                    "flex-1 text-center py-1 rounded-md",
                    value <= min && "cursor-not-allowed opacity-50"
                )}
                onClick={decrement}
                disabled={value <= min}
            >
                -
            </Button>
            <div className="flex-1 text-center py-2 px-3 text-black rounded-md">
                {value}
            </div>
            <Button
                variant={'default'}
                type="button"
                className={clsx(
                    "flex-1 text-center py-1 rounded-md",
                    value >= max && "cursor-not-allowed opacity-50"
                )}
                onClick={increment}
                disabled={value >= max}
            >
                +
            </Button>
        </div>
    );
}