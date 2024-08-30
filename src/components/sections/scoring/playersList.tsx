"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useGetPlayers from "@/api/app/useGetPlayers";
import { Player } from "@/stores/types";
import useDebounce from "@/hooks/useDebounce";

interface PlayersListProps {
    clubId: string;
    onPlayerSelect: (player: Player) => void;
}

export function PlayersList({ clubId, onPlayerSelect }: PlayersListProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<Player | null>(null);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const { getPlayers, players, loading, error } = useGetPlayers();

    React.useEffect(() => {
        if (clubId) {
            getPlayers({ id: clubId });
        }
    }, [clubId]);

    React.useEffect(() => {
        if (debouncedSearchQuery.trim() !== "") {
            getPlayers({ id: clubId, search: debouncedSearchQuery });
        } else {
            getPlayers({ id: clubId });
        }
    }, [debouncedSearchQuery, clubId]);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleSelect = (currentValue: string) => {
        const player = players?.find(value => value.id === currentValue);
        if (player) {
            setValue(player);
            onPlayerSelect(player);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="w-full">
                <Button
                    variant={"select"}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? value.name : "Select player..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false} className="w-[300px]">
                    <CommandInput
                        className="text-black w-full"
                        placeholder="Search player..."
                        value={searchQuery}
                        onValueChange={handleSearchChange}
                    />
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
                                    onSelect={() => handleSelect(player.id)}
                                >
                                    <div className="flex gap-2 items-center">
                                        <img src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'} className="h-8 w-8 rounded-full object-cover" />
                                        <div className="flex flex-col justify-between">
                                            <span>{player.name}</span>
                                            <small className="text-gray-500/70">{player.phoneNumber}</small>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}