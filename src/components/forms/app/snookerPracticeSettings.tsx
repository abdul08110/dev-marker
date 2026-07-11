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
import { Input } from '@/components/ui/input';

export interface SnookerPracticeSettingsData {
  format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
  durationInMinutes: string;
  noOfPlayers: '2' | '4';
  streaming: 'PUBLIC' | 'PRIVATE';
  teamOneHandicap: number;
  teamTwoHandicap: number;
  isRankingEvent: boolean;
  isStopClockEnabled: boolean;
  stopClockFrameTimeInSeconds: number;
  stopClockTurnTimeInSeconds: number;
  stopClockVoiceEnabled: boolean;
}

export type NoOfPlayersDefault = '2' | '4';

const formSchema = z
  .object({
    format: z.enum(['SNOOKER_15_RED', 'SNOOKER_10_RED', 'SNOOKER_6_RED']),
    durationInMinutes: z.string().regex(/^\d{1,2}:\d{2}:\d{2}$/, 'Duration must be in hh:mm:ss format'),
    noOfPlayers: z.enum(['2', '4']),
    streaming: z.enum(['PUBLIC', 'PRIVATE']),
    teamOneHandicap: z.number().min(0).max(147),
    teamTwoHandicap: z.number().min(0).max(147),
    isRankingEvent: z.boolean(),
    isStopClockEnabled: z.boolean(),
    stopClockFrameTimeInSeconds: z.number(),
    stopClockTurnTimeInSeconds: z.number(),
    stopClockVoiceEnabled: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isRankingEvent) return true;
      const [h, m, s] = data.durationInMinutes.split(':').map(Number);
      return h > 0 || m > 0 || s > 0;
    },
    { message: 'Duration must be greater than 0', path: ['durationInMinutes'] },
  )
  .superRefine((data, ctx) => {
    if (!data.isStopClockEnabled) return;

    if (data.stopClockFrameTimeInSeconds <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Frame time must be greater than 0',
        path: ['stopClockFrameTimeInSeconds'],
      });
    }

    if (data.stopClockTurnTimeInSeconds <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Turn time must be greater than 0',
        path: ['stopClockTurnTimeInSeconds'],
      });
    }

    if (
      data.stopClockFrameTimeInSeconds > 0 &&
      data.stopClockTurnTimeInSeconds > 0 &&
      data.stopClockTurnTimeInSeconds > data.stopClockFrameTimeInSeconds
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Turn time must be less than or equal to frame time',
        path: ['stopClockTurnTimeInSeconds'],
      });
    }
  });

interface SnookerSettingsFormSchema {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultNoOfPlayers?: NoOfPlayersDefault;
  teamOneLabel?: string;
  teamTwoLabel?: string;
  currentValues?: Partial<SnookerPracticeSettingsData>;
}

export function SnookerPracticeSettingsForm(props: SnookerSettingsFormSchema) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: 'SNOOKER_15_RED',
      durationInMinutes: '00:30:00',
      noOfPlayers: props.defaultNoOfPlayers ?? '2',
      streaming: 'PRIVATE',
      teamOneHandicap: 0,
      teamTwoHandicap: 0,
      isRankingEvent: false,
      isStopClockEnabled: false,
      stopClockFrameTimeInSeconds: 900,
      stopClockTurnTimeInSeconds: 30,
      stopClockVoiceEnabled: false,
      ...props.currentValues,
    },
  });

  const isStopClockEnabled = form.watch('isStopClockEnabled');

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
              <FormMessage />
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
            teamOneLabel={props.teamOneLabel}
            teamTwoLabel={props.teamTwoLabel}
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

        <FormField
          control={form.control}
          name="isStopClockEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white text-sm">Stop Clock</FormLabel>
              </div>
              <FormControl>
                <Switch className="w-14 h-6" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {isStopClockEnabled && (
          <>
            <FormField
              control={form.control}
              name="stopClockFrameTimeInSeconds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">Frame Time (seconds)</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={String(field.value)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          field.onChange(0);
                          return;
                        }
                        const parsed = parseInt(raw, 10);
                        if (!isNaN(parsed) && parsed >= 0) field.onChange(parsed);
                      }}
                      className="w-44 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stopClockTurnTimeInSeconds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">Turn Time (seconds)</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={String(field.value)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          field.onChange(0);
                          return;
                        }
                        const parsed = parseInt(raw, 10);
                        if (!isNaN(parsed) && parsed >= 0) field.onChange(parsed);
                      }}
                      className="w-44 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stopClockVoiceEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">Voice Countdown</FormLabel>
                  </div>
                  <FormControl>
                    <Switch className="w-14 h-6" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="mt-auto">
          Save changes
        </Button>
      </form>
    </Form>
  );
}
