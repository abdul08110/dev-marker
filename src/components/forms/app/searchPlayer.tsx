import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSearchPlayers from '@/api/app/useSearchPlayer';
import useAddPlayers from '@/api/app/useAddPlayers';
import { Player } from '@/stores/types';

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
    </Form>
  );
}
