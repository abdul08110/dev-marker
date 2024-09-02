import { PointType, TeamDetails } from '@/stores/types';
import clsx from 'clsx';
import { SnookerPointTypeDisplay } from './snookerPointTypesDisplay';
import { SnookerBreakScoreDisplay } from './snookerBreakScoreDisplay';

interface PlayerTeamCardProps {
    data: TeamDetails,
    matchId: string | null,
    onPlayerCardClick: (playerIndex: number) => void;
    onPlayerTeamCardSelect: () => void;
    teamSetScore: number;
    activeTurnPointTypes: PointType[];
    activeTurnScore: number;
}

export function PlayerTeamCard(props: PlayerTeamCardProps) {
    // const activePlayer = props.data.players.find(player => player.isActive) || props.data.players[0];
    const isTeamActive = props.data.players.some(player => player.isActive);

    return (
        <div onClick={props.onPlayerTeamCardSelect} className={clsx("rounded-md p-4 flex flex-col items-center gap-4 w-full", {
            'bg-lightSecondary': !isTeamActive,
            'bg-primary': isTeamActive,
        })}>
            <div className="flex-grow flex flex-col justify-start items-center gap-4 min-h-24">
                <h3 className="text-white text-6xl">{props.teamSetScore}</h3>
                {isTeamActive ? <SnookerPointTypeDisplay activeTurnPointTypes={props.activeTurnPointTypes} /> : <></>}
                {isTeamActive && props.activeTurnScore > 0 ? <SnookerBreakScoreDisplay breakScore={props.activeTurnScore} /> : <></>}
            </div>
            {
                props.data.players.map((player, playerIndex) =>
                    <button key={playerIndex} onClick={() => props.onPlayerCardClick(playerIndex)} className={clsx("flex justify-center items-center px-4 py-1 rounded truncate w-full", {
                        'bg-lighterSecondary text-white': !isTeamActive,
                        'bg-white text-black': isTeamActive,
                    })}
                    >
                        {player.playerName}
                    </button>
                )
            }
        </div>
    )
}