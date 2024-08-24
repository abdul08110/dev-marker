import clsx from "clsx";

interface PenaltySelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export function PenaltySelector({ value, onChange }: PenaltySelectorProps) {
    const penalties = [4, 5, 6, 7];

    return (
        <div className="flex bg-gray-300 rounded-lg p-1">
            {penalties.map((penalty) => (
                <div
                    key={penalty}
                    className={clsx(
                        "cursor-pointer flex-1 text-center px-4 py-2 rounded-md",
                        penalty === value ? "bg-primary text-white shadow-md" : "bg-gray-300 text-gray-800"
                    )}
                    onClick={() => onChange(penalty)}
                >
                    {penalty}
                </div>
            ))}
        </div>
    );
}