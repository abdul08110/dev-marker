interface SnookerFramesSummaryProps {
    team1Score: number;
    team2Score: number;
}

export function SnookerFramesSummary(props: SnookerFramesSummaryProps) {
    return (
        <div className="w-full container">
            <div className="flex justify-between bg-black p-2 text-white">
                <span>({props.team1Score})</span>
                <span>({props.team2Score})</span>
            </div>
        </div>
    );
}