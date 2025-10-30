import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { toast } from '../ui/use-toast';
import { decryptQrCode } from '@/utils/decryptQr';

interface ScanPlayerQrModalProps {
  onCloseModal: () => void;
  isOpen: boolean;
  onPlayerFound: (playerId: string) => void;
  isLoading?: boolean;
}

export function ScanPlayerQrModal({ onCloseModal, isOpen, onPlayerFound, isLoading = false }: ScanPlayerQrModalProps) {
  const handleScan = async (value: IDetectedBarcode[]) => {
    try {
      const encryptedData = value[0].rawValue;
      const decryptedData = decryptQrCode(encryptedData);
      const playerId = decryptedData as string;
      
      onPlayerFound(playerId);
      onCloseModal();
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to scan QR code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (value === false) onCloseModal();
      }}
    >
      <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black flex flex-col gap-4 justify-center items-center p-4 w-[90%]">
        <DialogTitle className="text-white text-center font-medium">Scan Player QR Code</DialogTitle>
        {isLoading ? (
          <div className="text-white">Loading player details...</div>
        ) : (
          <Scanner onScan={(result) => handleScan(result)} />
        )}
      </DialogContent>
    </Dialog>
  );
} 