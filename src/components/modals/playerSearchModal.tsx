import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { SearchPlayerForm } from "../forms/app/searchPlayer";
import { Player } from "@/stores/types";
import { PlayerAddModal } from "./playerAddModal";

interface PlayerSearchModalProps {
    onPlayerConfirm: (player: Player) => void;
}

export function PlayerSearchModal(props: PlayerSearchModalProps) {
    return (
        <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
            <DialogTitle></DialogTitle>
            <div className="container">
                <div className="flex flex-col rounded-md overflow-hidden gap-0">
                    <div className="bg-black px-3 py-5">
                        <span className="text-white font-medium">Search Player</span>
                    </div>
                    <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
                        <SearchPlayerForm onPlayerConfirm={props.onPlayerConfirm} />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <DialogClose asChild>
                                <Button variant={'secondary'}>Cancel</Button>
                            </DialogClose>
                            <Dialog>
                                <DialogTrigger asChild className='p-0 bg-transparent'>
                                    <Button variant={'default'}>Add a new Player</Button>
                                </DialogTrigger>
                                <PlayerAddModal onPlayerConfirm={props.onPlayerConfirm} />
                            </Dialog>

                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )

}