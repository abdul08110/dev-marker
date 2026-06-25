import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Player } from '@/stores/types';

interface PlayerConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  player: Player | null;
  loading?: boolean;
}

export function PlayerConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  player,
  loading = false,
}: PlayerConfirmationModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Confirm Player Selection</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 p-4">
          <img
            src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.jpg'}
            className="h-20 w-20 rounded-full object-cover"
            alt={player.name}
          />

          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">{player.name}</h3>
            {player.phoneNumber && <p className="text-sm text-white/70">{player.phoneNumber}</p>}
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1" disabled={loading}>
              {loading ? 'Adding...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
