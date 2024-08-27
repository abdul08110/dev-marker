import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Player } from "@/stores/types";
import { AddPlayerForm } from "../forms/app/addPlayer";

interface PlayerAddModalProps {
    onPlayerConfirm: (player: Player) => void;
}

export function PlayerAddModal(props: PlayerAddModalProps) {
    return (
        <DialogContent className="top-0 left-0 absolute h-full bg-transparent w-full flex justify-center items-center">
            <DialogTitle></DialogTitle>
            <div className="container">
                <div className="flex flex-col rounded-md overflow-hidden gap-0">
                    <div className="bg-black px-3 py-5">
                        <span className="text-white font-medium">Add Player</span>
                    </div>
                    <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
                        <AddPlayerForm onPlayerConfirm={props.onPlayerConfirm} />
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}