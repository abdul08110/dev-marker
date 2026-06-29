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

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.setSelectionRange(0, 0);
    };

    return (
        <div className="flex gap-6">
            <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{teamOneLabel}</p>
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={String(teamOneValue)}
                    onChange={(e) => handleChange(e.target.value, onTeamOneChange)}
                    onFocus={handleFocus}
                    className="w-24 text-white text-center"
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{teamTwoLabel}</p>
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={String(teamTwoValue)}
                    onChange={(e) => handleChange(e.target.value, onTeamTwoChange)}
                    onFocus={handleFocus}
                    className="w-24 text-white text-center"
                />
            </div>
        </div>
    );
};

export default HandicapSelector;
