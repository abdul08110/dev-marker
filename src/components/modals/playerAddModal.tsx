import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { SearchPlayerForm } from "../forms/app/searchPlayer";

interface PlayerAddModalProps {
}

export function PlayerSearchModal(props: PlayerAddModalProps) {
    return (
        <DialogContent className="top-0 left-0 absolute h-full bg-transparent w-full flex justify-center items-center">
            <DialogTitle></DialogTitle>
            <div className="container">
                <div className="flex flex-col rounded-md overflow-hidden gap-0">
                    <div className="bg-black px-3 py-5">
                        <span className="text-white font-medium">Search Player</span>
                    </div>
                    <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
                        <SearchPlayerForm />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Button variant={'secondary'}>Cancel</Button>
                            <Button variant={'default'}>Add a new Player</Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )

}