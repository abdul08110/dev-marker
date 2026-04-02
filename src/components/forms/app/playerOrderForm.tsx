import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlayerDetails } from '@/stores/types';

const formSchema = z.object({
  breakPlayerId: z.string().min(1, 'Please select a breaking player'),
  followThroughPlayerId: z.string().min(1, 'Please select a follow through player'),
});

interface PlayerOrderFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  teamOnePlayers: PlayerDetails[];
  teamTwoPlayers: PlayerDetails[];
  activeTeamIndex: number | null;
}

export function PlayerOrderForm(props: PlayerOrderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breakPlayerId: '',
      followThroughPlayerId: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-4 h-full">
        <FormField
          control={form.control}
          name="breakPlayerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Breaking Player</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Select Player to Break" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black">
                  {props.activeTeamIndex === 0
                    ? props.teamOnePlayers.map((value, index) => (
                        <SelectItem key={index} value={value.id!} className="text-white">
                          {value.name}
                        </SelectItem>
                      ))
                    : props.teamTwoPlayers.map((value, index) => (
                        <SelectItem key={index} value={value.id!} className="text-white">
                          {value.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="followThroughPlayerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Follow Through Player</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Select Player to Follow Through" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black">
                  {props.activeTeamIndex === 0
                    ? props.teamTwoPlayers.map((value, index) => (
                        <SelectItem key={index} value={value.id!} className="text-white">
                          {value.name}
                        </SelectItem>
                      ))
                    : props.teamOnePlayers.map((value, index) => (
                        <SelectItem key={index} value={value.id!} className="text-white">
                          {value.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <Button type="submit">Save changes</Button>
          <Button variant={'secondary'} onClick={() => props.onCancel()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
