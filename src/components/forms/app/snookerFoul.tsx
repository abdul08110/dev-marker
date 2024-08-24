import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { PenaltySelector } from "@/components/ui/penaltySelector";
import { SpinButton } from "@/components/ui/spinButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface SnookerFoulData {
    penalty: number,
    missCalled: boolean,
    freeBall: boolean,
    redsLost: number,
}

const formSchema = z.object({
    penalty: z.number(),
    missCalled: z.boolean(),
    freeBall: z.boolean(),
    redsLost: z.number(),
});

interface SnookerFoulFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}


export function SnookerFoulForm(props: SnookerFoulFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            penalty: 4,
            missCalled: false,
            freeBall: false,
            redsLost: 0
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-2 h-full">
                
                <FormField
                    control={form.control}
                    name="penalty"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormLabel className="text-white text-base">
                                Penalty:
                            </FormLabel>
                            <FormControl>
                                <PenaltySelector value={field.value} onChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="redsLost"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
                            <FormLabel className="text-white text-base">
                                Reds Lost:
                            </FormLabel>
                            <FormControl>
                                <SpinButton
                                    value={field.value}
                                    onChange={field.onChange}
                                    min={0}
                                    max={10}
                                    step={1}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="missCalled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-6">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-base">
                                    Miss Called ?
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Checkbox
                                    className="p-0  w-4 h-4"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="freeBall"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-white text-base">
                                    Free Ball ?
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Checkbox
                                    className="p-0 w-4 h-4"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                        </FormItem>
                    )} />
                <Button type="submit" className="mt-auto">Save changes</Button>
            </form>
        </Form>
    )

}