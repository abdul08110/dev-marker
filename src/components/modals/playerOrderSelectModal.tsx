import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { PlayerDetails } from '@/stores/types';
import { PlayerOrderForm } from '../forms/app/playerOrderForm';

interface PlayerOrderSelectModal {
  onOrderConfirm: (values: { breakPlayerId: string; followThroughPlayerId: string; }) => void;
  activeTeamIndex: number | null;
  isModalOpen: boolean;
  teamOnePlayers: PlayerDetails[];
  teamTwoPlayers: PlayerDetails[];
  closeModal: () => void;
}

export function PlayerOrderSelectModal(props: PlayerOrderSelectModal) {
  return (
    <Dialog open={props.isModalOpen} onOpenChange={(value) => console.log(value)}>
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>
        <div className="container">
          <div className="flex flex-col rounded-md overflow-hidden bg-black">
            <div className="bg-black px-3 py-5">
              <span className="text-white font-medium">Select Player Order</span>
            </div>
            <PlayerOrderForm
              onCancel={props.closeModal}
              teamOnePlayers={props.teamOnePlayers}
              teamTwoPlayers={props.teamTwoPlayers}
              activeTeamIndex={props.activeTeamIndex}
              onSubmit={props.onOrderConfirm}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
