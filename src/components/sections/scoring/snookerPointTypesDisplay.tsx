import { PointType } from "@/stores/types";
import clsx from "clsx";


interface SnookerPointTypeDisplayProps {
    activeTurnPointTypes: PointType[]
}

export function SnookerPointTypeDisplay(props: SnookerPointTypeDisplayProps) {
    const pointTypeToColorClass = {
        [PointType.YELLOW]: "bg-yellow-500",
        [PointType.GREEN]: "bg-green-500",
        [PointType.RED]: "bg-red-500",
        [PointType.FOUL]: "bg-gray-500",
        [PointType.BROWN]: "bg-yellow-900",
        [PointType.BLUE]: "bg-blue-500",
        [PointType.PINK]: "bg-pink-500",
        [PointType.BLACK]: "bg-black"
    };

    return (
        <div className="w-full flex flex-wrap gap-1 justify-center">
            {
                props.activeTurnPointTypes.map((value, index) => (
                    <div
                        key={index}
                        className={clsx("w-4 h-4 rounded-full", pointTypeToColorClass[value])}
                    >
                    </div>
                ))
            }
        </div>
    );
}