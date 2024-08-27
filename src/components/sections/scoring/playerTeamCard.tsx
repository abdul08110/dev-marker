import { PlayerSelectModal } from '@/components/modals/playerSelectModal';
import { Player, PointType, TeamDetails } from '@/stores/types';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useState } from 'react';
import { SnookerPointTypeDisplay } from './snookerPointTypesDisplay';
import { SnookerBreakScoreDisplay } from './snookerBreakScoreDisplay';

interface PlayerTeamCardProps {
    data: TeamDetails,
    matchId: string | null,
    onPlayerConfirm: (player: Player, index: number) => void;
    onPlayerTeamCardSelect: () => void;
    teamSetScore: number;
    activeTurnPointTypes: PointType[];
    activeTurnScore: number;
}

export function PlayerTeamCard(props: PlayerTeamCardProps) {
    const activePlayer = props.data.players.find(player => player.isActive) || props.data.players[0];
    const isTeamActive = props.data.players.some(player => player.isActive);

    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    const handlePlayerConfirm = (player: Player, index: number) => {
        props.onPlayerConfirm(player, index);
        setOpenDialogIndex(null);
    };

    const handleDialogOpen = (index: number) => {
        setOpenDialogIndex(index);
    };

    const handlePlayerTeamCardSelect = () => {
        if (props.matchId) {
            props.onPlayerTeamCardSelect();
        }
    }

    return (
        <div onClick={handlePlayerTeamCardSelect} className={clsx("rounded-md p-4 flex flex-col items-center gap-4 w-full", {
            'bg-lightSecondary': !isTeamActive,
            'bg-primary': isTeamActive,
        })}>
            <div className="flex-grow flex flex-col justify-center items-center gap-4 min-h-24">
                <h3 className="text-white text-6xl">{props.teamSetScore}</h3>
                {activePlayer.playerImage ? (
                    <div className="h-20 w-20 border-2 border-white">
                        <img src={activePlayer.playerImage} className="w-20 h-20 object-cover object-center" alt={activePlayer.playerName} />
                    </div>
                ) : null}
                {isTeamActive ? <SnookerPointTypeDisplay activeTurnPointTypes={props.activeTurnPointTypes} /> : <></>}
                {isTeamActive && props.activeTurnScore > 0 ? <SnookerBreakScoreDisplay breakScore={props.activeTurnScore} /> : <></>}
            </div>
            {
                props.data.players.map((player, playerIndex) =>
                    <Dialog open={openDialogIndex === playerIndex} onOpenChange={(isOpen) => isOpen ? handleDialogOpen(playerIndex) : setOpenDialogIndex(null)} key={playerIndex}>
                        <DialogTrigger className='p-0 bg-transparent'>
                            <div className={clsx("flex justify-center items-center px-4 py-1 rounded", {
                                'bg-lighterSecondary text-white': !isTeamActive,
                                'bg-white text-black': isTeamActive,
                            })}
                            >
                                {player.playerName}
                            </div>

                        </DialogTrigger>
                        {
                            props.data.players.some(player => player.id === null) || !props.matchId ?
                                <PlayerSelectModal onPlayerConfirm={(e) => handlePlayerConfirm(e, playerIndex)} playerNumber={playerIndex + 1} /> : <></>
                        }
                    </Dialog>
                )
            }
        </div>
    )
}