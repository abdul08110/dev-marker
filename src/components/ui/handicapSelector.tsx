import React from 'react';
import { Input } from '@/components/ui/input';

interface HandicapSelectorProps {
    teamOneValue: number;
    teamTwoValue: number;
    onTeamOneChange: (value: number) => void;
    onTeamTwoChange: (value: number) => void;
    teamOneLabel?: string;
    teamTwoLabel?: string;
}

const HandicapSelector: React.FC<HandicapSelectorProps> = ({
    teamOneValue,
    teamTwoValue,
    onTeamOneChange,
    onTeamTwoChange,
    teamOneLabel = 'Team A',
    teamTwoLabel = 'Team B',
}) => {
    const handleChange = (raw: string, cb: (v: number) => void) => {
        if (raw === '') { cb(0); return; }
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 147) cb(parsed);
    };

    return (
        <div className="flex gap-6">
            <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{teamOneLabel}</p>
                <Input
                    type="number"
                    min={0}
                    max={147}
                    value={teamOneValue}
                    onChange={(e) => handleChange(e.target.value, onTeamOneChange)}
                    className="w-24 text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{teamTwoLabel}</p>
                <Input
                    type="number"
                    min={0}
                    max={147}
                    value={teamTwoValue}
                    onChange={(e) => handleChange(e.target.value, onTeamTwoChange)}
                    className="w-24 text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
        </div>
    );
};

export default HandicapSelector;
