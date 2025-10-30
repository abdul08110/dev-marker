import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSearchPlayers from '@/api/app/useSearchPlayer';
import useAddPlayers from '@/api/app/useAddPlayers';
import useGetPlayerById from '@/api/app/useGetPlayerById';
import { Player } from '@/stores/types';
import { ScanQrCode } from 'lucide-react';
import { ScanPlayerQrModal } from '@/components/modals/ScanPlayerQrModal';
import { toast } from '@/components/ui/use-toast';

const baseSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, { message: 'Phone number must be exactly 10 digits' })
    .regex(/^\d{10}$/, { message: 'Phone number must be a 10-digit number' }),
});

const optionalNameSchema = baseSchema.extend({
  name: z.string().optional(),
});

const mandatoryNameSchema = baseSchema.extend({
  name: z.string().min(1, { message: 'Name is required' }),
});

interface PlayerSearchProps {
  onPlayerConfirm: (player: Player) => void;
  type: 'MEMBER' | 'GUEST';
  clubId: string;
}

export function SearchPlayerForm(props: PlayerSearchProps) {
  const { getPlayers, loading } = useSearchPlayers();
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const addPlayerProps = useAddPlayers();
  const { getPlayerById, loading: loadingPlayerDetails } = useGetPlayerById();
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isFetchingPlayer, setIsFetchingPlayer] = useState<boolean>(false);

  const schema = searchAttempted ? mandatoryNameSchema : optionalNameSchema;

  const form = useForm<z.infer<typeof optionalNameSchema> | z.infer<typeof mandatoryNameSchema>>({
    resolver: zodResolver(searchAttempted ? mandatoryNameSchema : optionalNameSchema),
    defaultValues: {
      phoneNumber: '',
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setSearchAttempted(true);
    const result = await getPlayers({ phoneNumber: values.phoneNumber });
    if (result && result.result) {
      setSelectedPlayer(result.result);
      form.setValue('name', result.result.name || '');
    } else {
      setSelectedPlayer(null);
      form.setValue('name', '');
    }
  }

  const handleAddPlayer = async () => {
    if (selectedPlayer && props.type === 'GUEST') {
      props.onPlayerConfirm(selectedPlayer);
    } else {
      const response = await addPlayerProps.addPlayer({
        name: form.getValues('name')!,
        phoneNumber: form.getValues('phoneNumber'),
        type: props.type,
        clubId: props.clubId,
      });

      if (response) {
        await props.onPlayerConfirm(response.result);
      }
    }
  };

  const handlePlayerFound = async (playerId: string) => {
    try {
      setIsFetchingPlayer(true);
      const playerData = await getPlayerById(playerId);
      if (playerData && playerData.result) {
        setSelectedPlayer(playerData.result);
        form.setValue('name', playerData.result.name || '');
        form.setValue('phoneNumber', playerData.result.phoneNumber || '');
        setSearchAttempted(true);
      } else {
        throw new Error('Failed to fetch player details');
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch player details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingPlayer(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {searchAttempted && (
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {searchAttempted ? (
          <Button type="button" onClick={handleAddPlayer} className="w-full" disabled={addPlayerProps.loading}>
            Add Player
          </Button>
        ) : (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Searching...' : 'Search Player'}
          </Button>
        )}
      </form>
      
      <div className="mt-4">
        <Button 
          type="button" 
          onClick={() => setIsQrModalOpen(true)} 
          className="w-full flex items-center justify-center gap-2"
          disabled={isFetchingPlayer}
        >
          <ScanQrCode className="h-4 w-4" />
          Scan QR Code
        </Button>
      </div>

      <ScanPlayerQrModal
        isOpen={isQrModalOpen}
        onCloseModal={() => setIsQrModalOpen(false)}
        onPlayerFound={handlePlayerFound}
        isLoading={loadingPlayerDetails || isFetchingPlayer}
      />
    </Form>
  );
}
