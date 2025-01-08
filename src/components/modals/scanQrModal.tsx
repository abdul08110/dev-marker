import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Select } from '../ui/select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import useLinkDevice from '@/api/auth/useLinkDevice';
import { toast } from '../ui/use-toast';

interface ScanQrCodeModalProps {
  onCloseModal: () => void;
  isOpen: boolean;
  venueId: string;
}

export function ScanQrModal(props: ScanQrCodeModalProps) {
  const { linkDevice } = useLinkDevice();
  const [type, setType] = useState<'SCOREBOARD' | 'TV'>('TV');

  const handleScan = async (value: IDetectedBarcode[]) => {
    const identifier = value[0].rawValue;
    const res = await linkDevice({ venueId: props.venueId, type, deviceIdentifier: identifier });

    if (res === true) {
      toast({
        title: 'Device linked',
        description: 'New device linked',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Device Not Linked',
        description: 'Please try again',
        variant: 'destructive',
      });
    }

    props.onCloseModal();
  };

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(value) => {
        if (value === false) props.onCloseModal();
      }}
    >
      <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black flex flex-col gap-4 justify-center items-center p-4 w-[90%]">
        <DialogTitle className="text-white text-center font-medium">Select Device Type and Scan Qr</DialogTitle>

        <Select defaultValue="SCOREBOARD" onValueChange={(value) => setType(value as 'SCOREBOARD' | 'TV')}>
          <SelectTrigger className="w-[180px] text-white">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TV">TV</SelectItem>
            <SelectItem value="SCOREBOARD">Scoreboard</SelectItem>
          </SelectContent>
        </Select>

        <Scanner onScan={(result) => handleScan(result)} />
      </DialogContent>
    </Dialog>
  );
}
