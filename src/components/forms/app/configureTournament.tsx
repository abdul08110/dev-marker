import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { TournamentTeam } from '@/stores/types';
import { TeamSelector } from '@/components/ui/team-selector';
import { Input } from '@/components/ui/input';

export interface ConfigureTournamentData {
  raceTo: number;
  teamOneId: string;
  teamTwoId: string;
  teamOneHandicap: string;
  teamTwoHandicap: string;
}

const formSchema = z.object({
  raceTo: z.number(),
  teamOneId: z.string(),
  teamTwoId: z.string(),
  teamOneHandicap: z.string(),
  teamTwoHandicap: z.string(),
});

interface ConfigureTournamentProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  teams: TournamentTeam[] | null;
}

export function TournamentConfigurationForm(props: ConfigureTournamentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      raceTo: 100,
      teamOneHandicap: '0',
      teamTwoHandicap: '0',
    },
  });

  const teamOneId = form.watch('teamOneId');
  const teamTwoId = form.watch('teamTwoId');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-4 h-full">
        <FormField
          control={form.control}
          name="raceTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Race to</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          name="teamOneId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Player One</FormLabel>
              <FormControl>
                <TeamSelector
                  value={field.value}
                  teams={props.teams}
                  disabledTeamList={teamTwoId ? [teamTwoId] : []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamOneHandicap"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Player One Handicap</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="teamTwoId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Player Two</FormLabel>
              <FormControl>
                <TeamSelector
                  value={field.value}
                  teams={props.teams}
                  disabledTeamList={teamOneId ? [teamOneId] : []} // Disable selected team from Team One
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamTwoHandicap"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Player Two Handicap</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
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
