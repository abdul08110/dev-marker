import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { PlayersList } from "../sections/scoring/playersList";
import { Button } from "../ui/button";
import { PlayerSearchModal } from "./playerSearchModal";
import { Player } from "@/stores/types";

interface PlayerSelectModalProps {
    onPlayerConfirm: (player: Player) => void;
    clubId: string;
    teamIndex: number;
    playerIndex: number;
    isModalOpen: boolean;
}

export function PlayerSelectModal(props: PlayerSelectModalProps) {
    return (
        <Dialog open={props.isModalOpen}>
            <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
                <DialogTitle></DialogTitle>
                <div className="container">
                    <div className="flex flex-col rounded-md overflow-hidden">
                        <div className="bg-black px-3 py-5">
                            <span className="text-white font-medium">Select Team {props.teamIndex + 1} player {props.playerIndex + 1}</span>
                        </div>
                        <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
                            <PlayersList onPlayerSelect={props.onPlayerConfirm} clubId={props.clubId} />

                            <p className="text-white">OR</p>

                            <Dialog>
                                <DialogTrigger className='p-0 bg-transparent'>
                                    <Button className="w-full" variant={'default'}>Add Player</Button>
                                </DialogTrigger>
                                <PlayerSearchModal onPlayerConfirm={props.onPlayerConfirm} />
                            </Dialog>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <DialogClose asChild>
                                    <Button variant={'secondary'}>Cancel</Button>
                                </DialogClose>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}