import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSearchPlayers from "@/api/app/useSearchPlayer";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone number must be a 10-digit number" }),
});

export function SearchPlayerForm() {
  const { getPlayers, loading, player, error } = useSearchPlayers();
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchAttempted(true);
    await getPlayers(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

        {loading && <p className="text-gray-500">Searching...</p>}

        {!loading && player && searchAttempted && (
          <div className="mt-2 bg-[#3B3B3B] rounded flex gap-4 p-2">
            <img
              src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
              alt={player.name}
              className="w-8 h-8 overflow-hidden object-cover rounded-full"
            />
            <div className="flex items-center">
              <span className="text-white">{player.name}</span>
            </div>
          </div>
        )}

        {!loading && !player && searchAttempted && !error && (
          <p className="text-red-500 mt-2">No player found with this phone number.</p>
        )}

        {error && searchAttempted && <p className="text-red-500 mt-2">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Searching...' : 'Search Player'}
        </Button>
      </form>
    </Form>
  );
}