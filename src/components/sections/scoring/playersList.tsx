"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useGetPlayers from "@/api/app/useGetPlayers"
import { Player } from "@/stores/types"

interface PlayersListProps {
    clubId: string;
    onPlayerSelect: (player: Player | null) => void;
}

export function PlayersList({ clubId, onPlayerSelect }: PlayersListProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<Player | null>(null)
    const { getPlayers, players, loading, error } = useGetPlayers()

    React.useEffect(() => {
        if (clubId) {
            getPlayers({ id: clubId })
        }
    }, [clubId])

    const handleSelect = (currentValue: string) => {
        const player = players!.find(value => value.id === currentValue)!;
        setValue(player);
        onPlayerSelect(player);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="w-full">
                <Button
                    variant={'select'}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? players?.find((player) => player.id === value.id)?.name
                        : "Select player..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className="w-[300px]">
                    <CommandInput className="text-black w-full" placeholder="Search player..." />
                    <CommandList>
                        {loading && <CommandEmpty>Loading players...</CommandEmpty>}
                        {error && <CommandEmpty>Error loading players</CommandEmpty>}
                        {!loading && !error && players && players.length === 0 && (
                            <CommandEmpty>No player found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {players?.map((player) => (
                                <CommandItem
                                    key={player.id}
                                    value={player.id}
                                    onSelect={handleSelect} // Use the handleSelect function
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.id === player.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {player.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}