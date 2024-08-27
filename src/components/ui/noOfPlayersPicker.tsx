import React from 'react';
import { Button } from '@/components/ui/button';

interface NumberOfPlayersSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const NumberOfPlayersSelector: React.FC<NumberOfPlayersSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex space-x-4">
            {/* Button for 2 Players */}
            <Button
                onClick={() => onChange('2')}
                className={`flex items-center p-4 space-x-2 rounded-md border ${value === '2' ? 'border-purple-500 bg-black text-white' : 'border-gray-300 bg-gray-800 text-white'
                    }`}
            >
                <span>2 Players</span>
            </Button>

            {/* Button for 4 Players */}
            <Button
                onClick={() => onChange('4')}
                className={`flex items-center p-4 space-x-2 rounded-md border ${value === '4' ? 'border-purple-500 bg-black text-white' : 'border-gray-300 bg-gray-800 text-white'
                    }`}
            >
                <span>4 Players</span>
            </Button>
        </div>
    );
};

export default NumberOfPlayersSelector;
