import { Dialog, DialogClose, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { SearchPlayerForm } from '../forms/app/searchPlayer';
import { Player } from '@/stores/types';

interface PlayerSearchModalProps {
  onPlayerConfirm: (player: Player) => void;
  onCloseModal: () => void;
  type: 'MEMBER' | 'GUEST';
  isOpen: boolean;
  clubId: string;
}

export function PlayerSearchModal(props: PlayerSearchModalProps) {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(value) => {
        if (value === false) props.onCloseModal();
      }}
    >
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>
        <div className="container">
          <div className="flex flex-col rounded-md overflow-hidden gap-0">
            <div className="bg-black px-3 py-5">
              <span className="text-white font-medium">Search Player</span>
            </div>
            <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
              <SearchPlayerForm clubId={props.clubId} type={props.type} onPlayerConfirm={props.onPlayerConfirm} />

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
  );
}
