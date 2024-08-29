interface StatisticsProps {
    teamOnePOSN: number,
    teamTwoPOSM: number,
    teamOneAverage: string,
    teamTwoAverage: string
}

export function Statistics(props: StatisticsProps) {
    return (
        <div className="w-full">
            <div className="container flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-blue-500 text-white text-center p-2 w-full">
                        Team 1
                    </div>
                    <div className="bg-red-500 text-white text-center p-2 w-full">
                        Team 2
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-white">
                    <div className="text-left">{props.teamOnePOSN} %</div>
                    <div className="text-center text-primary font-bold">POSN</div>
                    <div className="text-right">{props.teamTwoPOSM} %</div>
                    <div className="text-left">({props.teamOneAverage})</div>
                    <div>&nbsp;</div>
                    <div className="text-right">({props.teamTwoAverage})</div>
                </div>
            </div>
        </div>
    )
}