import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface DurationPickerProps {
    value: string;
    onChange: (value: string) => void;
}

const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange }) => {
    const parts = value.split(':').map(Number);
    const hours = parts.length === 3 ? parts[0] : 0;
    const minutes = parts.length === 3 ? parts[1] : parts[0];
    const seconds = parts.length === 3 ? parts[2] : parts[1];

    const emit = (h: number, m: number, s: number) => {
        onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="flex space-x-4">
            <div className="flex flex-col">
                <label className="text-sm text-white">Hours</label>
                <Select onValueChange={(v) => emit(Number(v), minutes, seconds)} value={pad(hours)}>
                    <SelectTrigger className="p-2 border border-gray-300 rounded-md text-white">
                        <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={pad(i)}>{pad(i)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-white">Minutes</label>
                <Select onValueChange={(v) => emit(hours, Number(v), seconds)} value={pad(minutes)}>
                    <SelectTrigger className="p-2 border border-gray-300 rounded-md text-white">
                        <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={pad(i)}>{pad(i)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-white">Seconds</label>
                <Select onValueChange={(v) => emit(hours, minutes, Number(v))} value={pad(seconds)}>
                    <SelectTrigger className="p-2 border border-gray-300 rounded-md text-white">
                        <SelectValue placeholder="SS" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={pad(i)}>{pad(i)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default DurationPicker;
