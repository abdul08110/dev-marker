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
                type="button"
                onClick={() => onChange('2')}
                className={`flex items-center p-4 space-x-2 rounded-md border text-white ${value === '2' ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <span>2 Players</span>
            </Button>

            {/* Button for 4 Players */}
            <Button
                type="button"
                onClick={() => onChange('4')}
                className={`flex items-center p-4 space-x-2 rounded-md border text-white ${value === '4' ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <span>4 Players</span>
            </Button>
        </div>
    );
};

export default NumberOfPlayersSelector;
