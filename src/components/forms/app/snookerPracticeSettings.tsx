import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DurationPicker from '@/components/ui/durationPicker';
import NumberOfPlayersSelector from '@/components/ui/noOfPlayersPicker';
import HandicapSelector from '@/components/ui/handicapSelector';
import StreamingSelector from '@/components/ui/streamingSelector';
import { Switch } from '@/components/ui/switch';

export interface SnookerPracticeSettingsData {
  format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
  durationInMinutes: string;
  noOfPlayers: '2' | '4';
  streaming: 'PUBLIC' | 'PRIVATE';
  teamOneHandicap: number;
  teamTwoHandicap: number;
  isRankingEvent: boolean;
}

export type NoOfPlayersDefault = '2' | '4';

const formSchema = z.object({
  format: z.enum(['SNOOKER_15_RED', 'SNOOKER_10_RED', 'SNOOKER_6_RED']),
  durationInMinutes: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in mm:ss format'),
  noOfPlayers: z.enum(['2', '4']),
  streaming: z.enum(['PUBLIC', 'PRIVATE']),
  teamOneHandicap: z.number().min(0).max(147),
  teamTwoHandicap: z.number().min(0).max(147),
  isRankingEvent: z.boolean(),
});

interface SnookerSettingsFormSchema {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultNoOfPlayers?: NoOfPlayersDefault;
}

export function SnookerPracticeSettingsForm(props: SnookerSettingsFormSchema) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: 'SNOOKER_15_RED',
      durationInMinutes: '30:00',
      noOfPlayers: props.defaultNoOfPlayers ?? '2',
      streaming: 'PRIVATE',
      teamOneHandicap: 0,
      teamTwoHandicap: 0,
      isRankingEvent: false,
    },
  });

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
                  <SelectItem value="SNOOKER_15_RED">15 Reds</SelectItem>
                  <SelectItem value="SNOOKER_10_RED">10 Reds</SelectItem>
                  <SelectItem value="SNOOKER_6_RED">6 Reds</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white text-sm">Duration</FormLabel>
              </div>
              <FormControl>
                <DurationPicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noOfPlayers"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white text-sm">No Of Players</FormLabel>
              </div>
              <FormControl>
                <NumberOfPlayersSelector value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormItem className="flex flex-col">
          <div className="space-y-1 leading-none">
            <FormLabel className="text-white text-sm">Handicap</FormLabel>
          </div>
          <HandicapSelector
            teamOneValue={form.watch('teamOneHandicap')}
            teamTwoValue={form.watch('teamTwoHandicap')}
            onTeamOneChange={(v) => form.setValue('teamOneHandicap', v)}
            onTeamTwoChange={(v) => form.setValue('teamTwoHandicap', v)}
          />
        </FormItem>
        <FormField
          control={form.control}
          name="streaming"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white text-sm">Streaming</FormLabel>
              </div>
              <FormControl>
                <StreamingSelector value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRankingEvent"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white text-sm">Ranking</FormLabel>
              </div>
              <FormControl>
                <Switch className="w-14 h-6" checked={field.value} onCheckedChange={field.onChange} />
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
