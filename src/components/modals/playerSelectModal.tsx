import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { PlayersList } from "../sections/scoring/playersList";
import { Button } from "../ui/button";
import { PlayerSearchModal } from "./playerSearchModal";
import { useState } from "react";
import { toast } from '@/components/ui/use-toast';
import { Player } from "@/stores/types";

interface PlayerSelectModalProps {
    playerNumber: number;
    onPlayerConfirm: (player: Player) => void;
}

export function PlayerSelectModal(props: PlayerSelectModalProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const handlePlayerSelect = (player: Player | null) => {
        setSelectedPlayer(player);
    }

    const handleConfirmSelection = () => {
        if (!selectedPlayer) {
            toast({
                title: "Error",
                description: "Please Select Player First",
                variant: "destructive",
            });
        } else {
            props.onPlayerConfirm(selectedPlayer);
        }
    }

    return (
        <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
            <DialogTitle></DialogTitle>
            <div className="container">
                <div className="flex flex-col rounded-md overflow-hidden">
                    <div className="bg-black px-3 py-5">
                        <span className="text-white font-medium">Select Player {props.playerNumber}</span>
                    </div>
                    <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
                        <PlayersList onPlayerSelect={handlePlayerSelect} clubId="6667d81f91524250b4b4e1b5" />

                        <p className="text-white">OR</p>

                        <Dialog>
                            <DialogTrigger className='p-0 bg-transparent'>
                                <Button className="w-full" variant={'default'}>Add Player</Button>
                            </DialogTrigger>
                            <PlayerSearchModal />
                        </Dialog>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <DialogClose asChild>
                                <Button variant={'secondary'}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleConfirmSelection} variant={'default'}>Confirm Selection</Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}