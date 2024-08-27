import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpinButton } from "@/components/ui/spinButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DurationPicker from "@/components/ui/durationPicker";
import NumberOfPlayersSelector from "@/components/ui/noOfPlayersPicker";
import HandicapSelector from "@/components/ui/handicapSelector";
import StreamingSelector from "@/components/ui/streamingSelector";


export interface SnookerPracticeSettingsData {
    format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED',
    numberOfFrames: number,
    durationInMinutes: string,
    noOfPlayers: '2' | '4',
    streaming: 'PUBLIC' | 'PRIVATE',
    handicap: number
}

const formSchema = z.object({
    format: z.enum(['SNOOKER_15_RED', 'SNOOKER_10_RED', 'SNOOKER_6_RED']),
    numberOfFrames: z.number().min(1),
    durationInMinutes: z.string().regex(/^\d{1,2}:\d{2}$/, "Duration must be in mm:ss format"),
    noOfPlayers: z.enum(['2', '4']),
    streaming: z.enum(['PUBLIC', 'PRIVATE']),
    handicap: z.number().min(-147).max(147)
});

interface SnookerSettingsFormSchema {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}


export function SnookerPracticeSettingsForm(props: SnookerSettingsFormSchema) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            format: 'SNOOKER_15_RED',
            numberOfFrames: 1,
            durationInMinutes: '30:00',
            noOfPlayers: '2',
            streaming: 'PUBLIC',
            handicap: 0
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
                    name="numberOfFrames"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-white text-sm">
                                No Of Frames
                            </FormLabel>
                            <FormControl>
                                <div className="flex">
                                    <SpinButton
                                        value={field.value}
                                        onChange={field.onChange}
                                        min={1}
                                        max={10}
                                        step={1}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                    Duration
                                </FormLabel>
                            </div>
                            <FormControl>
                                <DurationPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="noOfPlayers"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                    No Of Players
                                </FormLabel>
                            </div>
                            <FormControl>
                                <NumberOfPlayersSelector value={field.value}
                                    onChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="handicap"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                    Handicap
                                </FormLabel>
                            </div>
                            <FormControl>
                                <HandicapSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                    playerNames={{ player1: 'Player 1', player2: 'Player 2' }}
                                />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="streaming"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-sm">
                                    Streaming
                                </FormLabel>
                            </div>
                            <FormControl>
                                <StreamingSelector value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )} />

                <Button type="submit" className="mt-auto">Save changes</Button>
            </form>
        </Form>
    )

}