import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Player, TournamentTeam } from '@/stores/types';
import { TeamSelector } from '@/components/ui/team-selector';
import { TeamPlayerSelector } from '@/components/ui/team-player-selector';
import { SpinButton } from '@/components/ui/spinButton';
import { Input } from '@/components/ui/input';

export interface ConfigureTournamentData {
  format: '15_REDS_SINGLE_FRAME' | '6_REDS_CUMULATIVE' | '10_REDS_SINGLE_FRAME';
  teamOneId: string;
  teamTwoId: string;
  teamOnePlayerOne: Player;
  teamTwoPlayerOne: Player;
  teamOneHandicap: number;
  teamTwoHandicap: number;
  tournamentTeamOneScore: number;
  tournamentTeamTwoScore: number;
}

const formSchema = z.object({
  format: z.enum(['15_REDS_SINGLE_FRAME', '6_REDS_CUMULATIVE', '10_REDS_SINGLE_FRAME']),
  teamOneId: z.string(),
  teamTwoId: z.string(),
  teamOnePlayerOne: z.object({
    name: z.string(),
    profilePhoto: z.string().nullable().optional(),
    id: z.string().nullable(),
    phoneNumber: z.string().optional(),
  }),
  teamTwoPlayerOne: z.object({
    name: z.string(),
    profilePhoto: z.string().nullable().optional(),
    id: z.string().nullable(),
    phoneNumber: z.string().optional(),
  }),
  teamOneHandicap: z.string().transform((val) => parseInt(val, 10)),
  teamTwoHandicap: z.string().transform((val) => parseInt(val, 10)),
  tournamentTeamOneScore: z.number(),
  tournamentTeamTwoScore: z.number(),
});

interface ConfigureTournamentProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  teams: TournamentTeam[] | null;
}

export function TournamentConfigurationForm(props: ConfigureTournamentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: '15_REDS_SINGLE_FRAME',
      teamOneHandicap: 0,
      teamTwoHandicap: 0,
      tournamentTeamOneScore: 0,
      tournamentTeamTwoScore: 0,
    },
  });

  const teamOneId = form.watch('teamOneId');
  const teamTwoId = form.watch('teamTwoId');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-4 h-full">
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15_REDS_SINGLE_FRAME">15 Reds Single Frame</SelectItem>
                  <SelectItem value="6_REDS_CUMULATIVE">6 Reds Cumulative</SelectItem>
                  <SelectItem value="10_REDS_SINGLE_FRAME">10 Reds Single Frame</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="teamOneId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm">Team One</FormLabel>
              <FormControl>
                <TeamSelector
                  value={field.value}
                  teams={props.teams}
                  disabledTeamList={teamTwoId ? [teamTwoId] : []} // Disable selected team from Team Two
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {teamOneId ? (
          <Controller
            name="teamOnePlayerOne"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Player One</FormLabel>
                <FormControl>
                  <TeamPlayerSelector value={field.value} teamId={teamOneId} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <></>
        )}

        <FormField
          control={form.control}
          name="teamOneHandicap"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Team One Handicap</FormLabel>
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
              <FormLabel className="text-white text-sm">Team Two</FormLabel>
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

        {teamTwoId ? (
          <Controller
            name="teamTwoPlayerOne"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Player Two</FormLabel>
                <FormControl>
                  <TeamPlayerSelector value={field.value} teamId={teamTwoId} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <></>
        )}

        <FormField
          control={form.control}
          name="teamTwoHandicap"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Team Two Handicap</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tournamentTeamOneScore"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white text-sm">Team One Score</FormLabel>
              <FormControl>
                <div className="w-44">
                  <SpinButton value={field.value} onChange={field.onChange} min={0} step={1} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tournamentTeamTwoScore"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white text-sm">Team Two Score</FormLabel>
              <FormControl>
                <div className="w-44">
                  <SpinButton value={field.value} onChange={field.onChange} min={0} step={1} />
                </div>
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
