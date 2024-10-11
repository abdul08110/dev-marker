import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { SpinButton } from '@/components/ui/spinButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export interface SnookerScoreCorrectionData {
  teamOneScore: number;
  teamTwoScore: number;
  redsRemaining: number;
}

const formSchema = z.object({
  teamOneScore: z.number(),
  teamTwoScore: z.number(),
  redsRemaining: z.number(),
});

interface SnookerScoreCorrectionProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  redsOnTable: number;
  teamOneScore: number;
  teamTwoScore: number;
  teamOneName: string;
  teamTwoName: string;
  maxReds: number;
}

export function SnookerScoreCorrectionForm(props: SnookerScoreCorrectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      redsRemaining: props.redsOnTable,
      teamOneScore: props.teamOneScore,
      teamTwoScore: props.teamTwoScore,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-2 h-full">
        <FormField
          control={form.control}
          name="teamOneScore"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
              <FormLabel className="text-white text-base">{props.teamOneName} Score</FormLabel>
              <FormControl>
                <SpinButton value={field.value} onChange={field.onChange} min={0} step={1} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teamTwoScore"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
              <FormLabel className="text-white text-base">{props.teamTwoName} Score</FormLabel>
              <FormControl>
                <SpinButton value={field.value} onChange={field.onChange} min={0} step={1} />
              </FormControl>
            </FormItem>
          )}
        />
        { props.redsOnTable > 0 ? <FormField
          control={form.control}
          name="redsRemaining"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
              <FormLabel className="text-white text-base">Red's Remaining</FormLabel>
              <FormControl>
                <SpinButton value={field.value} onChange={field.onChange} min={0} max={props.maxReds} step={1} />
              </FormControl>
            </FormItem>
          )}
        /> : <></> }
        
        <Button type="submit" className="mt-auto">
          OK
        </Button>
      </form>
    </Form>
  );
}
