import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from "@/stores/types";
import useAddPlayers from "@/api/app/useAddPlayers";

const formSchema = z.object({
    phoneNumber: z
        .string()
        .length(10, { message: "Phone number must be exactly 10 digits" })
        .regex(/^\d{10}$/, { message: "Phone number must be a 10-digit number" }),
    name: z
        .string()
});

interface AddPlayerFormProps {
    onPlayerConfirm: (player: Player) => void;
}


export function AddPlayerForm(props: AddPlayerFormProps) {
    const { addPlayer, loading } = useAddPlayers();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber: "",
            name: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await addPlayer(values);
        if (response) {
            console.log(response);
            await props.onPlayerConfirm(response.result);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 text-left">
                <div>
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Phone Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
            </form>
        </Form>
    );
}