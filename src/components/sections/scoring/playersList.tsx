"use client";

import * as React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import useGetPlayers from "@/api/app/useGetPlayers";
import { Player } from "@/stores/types";
import useDebounce from "@/hooks/useDebounce";

interface PlayersListProps {
    clubId: string;
    onPlayerSelect: (player: Player) => void;
    disabledPlayerList: (string | null)[]
}

export function PlayersList({ clubId, onPlayerSelect, disabledPlayerList }: PlayersListProps) {
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
        console.log(value);
        const player = players?.find(value => value.id === currentValue);
        if (player) {
            setValue(player);
            onPlayerSelect(player);
        }
    };

    return (
        <div className="w-full h-full">
            <Command shouldFilter={false} className="w-full mt-2 bg-transparent text-white">
                <CommandInput
                    className="text-white w-full"
                    placeholder="Search player..."
                    value={searchQuery}
                    onValueChange={handleSearchChange}
                />
                <CommandList className="h-full max-h-full">
                    {loading && <CommandEmpty>Loading players...</CommandEmpty>}
                    {error && <CommandEmpty>Error loading players</CommandEmpty>}
                    {!loading && !error && players && players.length === 0 && (
                        <CommandEmpty>No player found.</CommandEmpty>
                    )}
                    <CommandGroup>
                        {players?.map((player) => (
                            disabledPlayerList.includes(player.id) ? null : (
                                <CommandItem
                                    key={player.id}
                                    value={player.id!}
                                    onSelect={() => handleSelect(player.id!)}
                                >
                                    <div className="flex gap-2 items-center">
                                        <img src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'} className="h-8 w-8 rounded-full object-cover" />
                                        <div className="flex flex-col justify-between">
                                            <span className="text-white">{player.name}</span>
                                            <small className="text-white/70">{player.phoneNumber}</small>
                                        </div>
                                    </div>
                                </CommandItem>
                            )
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}