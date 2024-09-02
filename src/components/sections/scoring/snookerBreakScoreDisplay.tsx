interface SnookerBreakScoreDisplayProps {
    breakScore: number;
}

export function SnookerBreakScoreDisplay(props: SnookerBreakScoreDisplayProps) {
    return (
        <div className="w-full justify-start">
            <h5 className="text-white text-center">Break {props.breakScore}</h5>
        </div>
    );
}