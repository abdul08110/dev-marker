import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const addPlayerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phoneNumber: z
    .string()
    .length(10, { message: 'Phone number must be exactly 10 digits' })
    .regex(/^\d{10}$/, { message: 'Phone number must be a 10-digit number' }),
});

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phoneNumber: string }) => void;
  loading?: boolean;
}

export function AddPlayerModal({ isOpen, onClose, onSubmit, loading = false }: AddPlayerModalProps) {
  const form = useForm<z.infer<typeof addPlayerSchema>>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof addPlayerSchema>) => {
    onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      modal
      onOpenChange={(value) => {
        if (value === false) handleClose();
      }}
    >
      <DialogContent>
        <DialogTitle></DialogTitle>
        <div className="container">
          <div className="flex flex-col rounded-md overflow-hidden gap-0">
            <div>
              <span className="text-white font-medium">Add New Player</span>
            </div>
            <div className="flex flex-col px-3 py-5 bg-[#1F1F1F] gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter player name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter 10-digit phone number" maxLength={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Player'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

