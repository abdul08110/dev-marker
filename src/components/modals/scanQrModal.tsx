import { Dialog, DialogClose, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Select } from '../ui/select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScanQrCodeModalProps {
  onCloseModal: () => void;
  isOpen: boolean;
  venueId: string;
}

export function ScanQrModal(props: ScanQrCodeModalProps) {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(value) => {
        if (value === false) props.onCloseModal();
      }}
    >
      <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black flex flex-col gap-4 justify-center items-center p-4 w-[90%]">
        <DialogTitle className="text-white text-center font-medium">Select Device Type and Scan Qr</DialogTitle>

        <Select>
          <SelectTrigger className="w-[180px] text-white">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TV">TV</SelectItem>
            <SelectItem value="SCOREBOARD">Scoreboard</SelectItem>
          </SelectContent>
        </Select>

        <Scanner onScan={(result) => console.log(result)} />
      </DialogContent>
    </Dialog>
  );
}
