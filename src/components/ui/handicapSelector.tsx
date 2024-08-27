import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface HandicapSelectorProps {
    value: number;
    onChange: (value: number) => void;
    playerNames: { player1: string; player2: string };
}

const HandicapSelector: React.FC<HandicapSelectorProps> = ({ value, onChange, playerNames }) => {
    const handicapOptions = Array.from({ length: 295 }, (_, i) => i - 147);
    const selectedRef = useRef<HTMLDivElement | null>(null);

    const getLabel = (points: number) => {
        if (points < 0) {
            return `Give + ${Math.abs(points)} to ${playerNames.player1}`;
        } else if (points > 0) {
            return `Give + ${points} to ${playerNames.player2}`;
        }
        return "Play off levels";
    };

    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [value]);

    return (
        <div className="overflow-auto h-36 w-36 rounded-md shadow-inner">
            {handicapOptions.map((option) => (
                <div
                    key={option}
                    ref={value === option ? selectedRef : null}
                    className={clsx(
                        'text-center py-1 text-sm cursor-pointer',
                        {
                            'text-white font-bold': value === option,
                            'text-gray-400': value !== option
                        }
                    )}
                    onClick={() => onChange(option)}
                >
                    {getLabel(option)}
                </div>
            ))}
        </div>
    );
};

export default HandicapSelector;