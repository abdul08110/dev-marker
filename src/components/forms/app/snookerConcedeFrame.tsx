import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export interface SnookerConcedeFrameData {
  type: 'teamOne' | 'teamTwo';
}

const formSchema = z.object({
  type: z.enum(['teamOne', 'teamTwo'], {
    required_error: 'You need to select a Team',
  }),
});

interface SnookerScoreCorrectionProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  teamOneName: string;
  teamTwoName: string;
}

export function SnookerConcedeFrameForm(props: SnookerScoreCorrectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-2 h-full">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="teamOne" />
                    </FormControl>
                    <FormLabel className="font-normal text-white">{props.teamOneName}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="teamTwo" />
                    </FormControl>
                    <FormLabel className="font-normal text-white">{props.teamTwoName}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-auto">
          OK
        </Button>
      </form>
    </Form>
  );
}
