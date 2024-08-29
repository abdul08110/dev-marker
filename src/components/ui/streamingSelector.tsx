import React from 'react';
import clsx from 'clsx';

interface StreamingSelectorProps {
    value: 'PUBLIC' | 'PRIVATE';
    onChange: (value: 'PUBLIC' | 'PRIVATE') => void;
}

const StreamingSelector: React.FC<StreamingSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex space-x-4 mt-2">
            <div
                className={clsx(
                    'flex items-center space-x-2 p-2 border rounded-md cursor-pointer',
                    {
                        'bg-primary': value === 'PUBLIC',
                        'bg-secondnary ': value !== 'PUBLIC'
                    }
                )}
                onClick={() => onChange('PUBLIC')}
            >
                {/* <Checkbox type='button' checked={value === 'PUBLIC'} /> */}
                <span className="text-white">Public</span>
            </div>
            <div
                className={clsx(
                    'flex items-center space-x-2 p-2 border rounded-md cursor-pointer',
                    {
                        'bg-primary': value === 'PRIVATE',
                        'bg-secondnary ': value !== 'PRIVATE'
                    }
                )}
                onClick={() => onChange('PRIVATE')}
            >
                {/* <Checkbox type='button' checked={value === 'PRIVATE'} /> */}
                <span className="text-white">Private</span>
            </div>
        </div>
    );
};

export default StreamingSelector;