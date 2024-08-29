interface BreaksProps {
    team1Breaks: number[];
    team2Breaks: number[];
}

export function Breaks(props: BreaksProps) {
    const { team1Breaks, team2Breaks } = props;

    return (
        <div className="w-full">
            <div className="container flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="bg-blue-500 text-white text-center p-2 w-full">
                            Team 1
                        </div>
                        <ul className="w-full p-2 text-center">
                            {team1Breaks.map((breakScore, index) => (
                                <li key={index} className="text-white">
                                    {breakScore}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <div className="bg-red-500 text-white text-center p-2 w-full">
                            Team 2
                        </div>
                        <ul className="w-full  p-2 text-center">
                            {team2Breaks.map((breakScore, index) => (
                                <li key={index} className="text-white">
                                    {breakScore}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}