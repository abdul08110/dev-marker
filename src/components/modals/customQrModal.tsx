import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { decryptQrCode } from '@/utils/decryptQr';
import { toast } from '../ui/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface CustomQrModalProps {
  onCloseModal: () => void;
  isOpen: boolean;
  onPlayerFound: (playerId: string) => void;
  isLoading?: boolean;
}

export function CustomQrModal({ onCloseModal, isOpen, onPlayerFound, isLoading = false }: CustomQrModalProps) {
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
      <DialogContent className="bg-black border-white/20 text-white z-[9999]">
        <DialogTitle className="text-white text-center font-medium">Scan Player QR Code</DialogTitle>
        
        {isLoading ? (
          <div className="text-white text-center py-4">Loading player details...</div>
        ) : (
          <div className="flex justify-center">
            <Scanner onScan={(result) => handleScan(result)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 