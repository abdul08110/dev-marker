import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { TournamentTeam } from '@/stores/types';
import { TeamSelector } from '@/components/ui/team-selector';
import { Input } from '@/components/ui/input';

export interface AddTournamentTeamPlayerFormData {
  teamId: string;
  name: string;
  phone: string;
}

const formSchema = z.object({
  teamId: z.string(),
  name: z.string(),
  phone: z.string(),
});

interface ConfigureTournamentProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  teams: TournamentTeam[] | null;
}

export function AddTournamentTeamPlayerForm(props: ConfigureTournamentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-4 h-full">
        <Controller
          name="teamId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Team Name</FormLabel>
              <FormControl>
                <TeamSelector value={field.value} teams={props.teams} disabledTeamList={[]} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white text-sm">Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white text-sm">Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-auto">
          Save changes
        </Button>
      </form>
    </Form>
  );
}
