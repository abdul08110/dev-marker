import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface DurationPickerProps {
    value: string;
    onChange: (value: string) => void;
}

const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange }) => {
    const [minutes, seconds] = value.split(':').map(Number);

    const handleMinutesChange = (newMinutes: number) => {
        onChange(`${String(newMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    const handleSecondsChange = (newSeconds: number) => {
        onChange(`${String(minutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`);
    };

    return (
        <div className="flex space-x-4">
            <div className="flex flex-col">
                <label htmlFor="minutes" className="text-sm text-white">
                    Minutes
                </label>
                <Select
                    onValueChange={(value) => handleMinutesChange(Number(value))}
                    value={String(minutes)}
                >
                    <SelectTrigger className="p-2 border border-gray-300 rounded-md text-white">
                        <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="seconds" className="text-sm text-white">
                    Seconds
                </label>
                <Select
                    onValueChange={(value) => handleSecondsChange(Number(value))}
                    value={String(seconds)}
                >
                    <SelectTrigger className="p-2 border border-gray-300 rounded-md text-white">
                        <SelectValue placeholder="SS" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default DurationPicker;