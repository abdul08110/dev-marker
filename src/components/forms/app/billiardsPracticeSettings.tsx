import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DurationPicker from '@/components/ui/durationPicker';
import HandicapSelector from '@/components/ui/handicapSelector';
import StreamingSelector from '@/components/ui/streamingSelector';
import { SpinButton } from '@/components/ui/spinButton';
import { Switch } from '@/components/ui/switch';

export interface BilliardsPracticeSettingsData {
  format: 'BILLIARDS_TIME_BASED' | 'BILLIARDS_RACE_TO';
  durationInMinutes: string;
  noOfFrames: number;
  maxPointsPerFrame: number;
  streaming: 'PUBLIC' | 'PRIVATE';
  teamOneHandicap: number;
  teamTwoHandicap: number;
  isRankingEvent: boolean;
}

const formSchema = z
  .object({
    format: z.enum(['BILLIARDS_TIME_BASED', 'BILLIARDS_RACE_TO']),
    durationInMinutes: z.string().regex(/^\d{1,2}:\d{2}:\d{2}$/, 'Duration must be in hh:mm:ss format'),
    noOfFrames: z.number(),
    maxPointsPerFrame: z.number(),
    streaming: z.enum(['PUBLIC', 'PRIVATE']),
    teamOneHandicap: z.number().min(0).max(147),
    teamTwoHandicap: z.number().min(0).max(147),
    isRankingEvent: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isRankingEvent) return true;
      const [h, m, s] = data.durationInMinutes.split(':').map(Number);
      return h > 0 || m > 0 || s > 0;
    },
    { message: 'Duration must be greater than 0', path: ['durationInMinutes'] },
  );

interface BilliardsSettingFormSchema {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  teamOneLabel?: string;
  teamTwoLabel?: string;
}

export function BilliardsPracticeSettingsForm(props: BilliardsSettingFormSchema) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: 'BILLIARDS_TIME_BASED',
      durationInMinutes: '00:30:00',
      noOfFrames: 1,
      maxPointsPerFrame: 1,
      streaming: 'PRIVATE',
      teamOneHandicap: 0,
      teamTwoHandicap: 0,
      isRankingEvent: false,
    },
  });

  const selectedFormat = form.watch('format');

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
                  <SelectItem value="BILLIARDS_TIME_BASED">Time</SelectItem>
                  <SelectItem value="BILLIARDS_RACE_TO">Race to</SelectItem>
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

        {selectedFormat === 'BILLIARDS_RACE_TO' && (
          <>
            <FormField
              control={form.control}
              name="noOfFrames"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">No Of Frames</FormLabel>
                  </div>
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
              name="maxPointsPerFrame"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">Max Points</FormLabel>
                  </div>
                  <FormControl>
                    <div className="w-44">
                      <SpinButton value={field.value} onChange={field.onChange} min={0} step={1} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

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

        <Button type="submit" className="mt-auto">
          Save changes
        </Button>
      </form>
    </Form>
  );
}
