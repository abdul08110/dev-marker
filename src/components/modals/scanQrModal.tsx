import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Select } from '../ui/select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLinkDevice from '@/api/auth/useLinkDevice';
import { Form, FormField } from '@/components/ui/form';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ScanQrCodeModalProps {
  onCloseModal: () => void;
  isOpen: boolean;
  venueId: string;
}

export function ScanQrModal(props: ScanQrCodeModalProps) {
  const { linkDevice } = useLinkDevice();
  const formSchema = z.object({
    type: z.enum(['SCOREBOARD', 'TV']),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'SCOREBOARD',
    },
  });

  const handleScan = async (value: IDetectedBarcode[]) => {
    const identifier = value[0].rawValue;
    const type = form.getValues('type');

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

        <Form {...form}>
          <form className="flex flex-col gap-4 h-full">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px] text-white">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TV">TV</SelectItem>
                    <SelectItem value="SCOREBOARD">Scoreboard</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </form>
        </Form>

        <Scanner onScan={(result) => handleScan(result)} />
      </DialogContent>
    </Dialog>
  );
}
