import React, { useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useGetTournamentPlayers from '@/api/app/useGetTournamentPlayers';
import useDebounce from '@/hooks/useDebounce';
import { Player } from '@/stores/types';

interface TeamSelectorProps {
  onChange: (player: Player) => void;
  teamId: string;
  value: Player;
  disabledPlayerIds?: string[];
}

export function TeamPlayerSelector(props: TeamSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isDropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { getPlayers, players, loading } = useGetTournamentPlayers();

  useEffect(() => {
    if (props.teamId) {
      getPlayers({ id: props.teamId });
    }
  }, [props.teamId]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() !== '') {
      getPlayers({ id: props.teamId, search: debouncedSearchQuery });
    } else {
      getPlayers({ id: props.teamId });
    }

    setSearchQuery(debouncedSearchQuery);
    setDropdownVisible(debouncedSearchQuery !== '');
  }, [debouncedSearchQuery, props.teamId]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (playerId: string) => {
    const player = players?.find((value) => value.id === playerId);
    if (player) {
      setSearchQuery(player.name);
      props.onChange(player);
      setDropdownVisible(false);
    }
  };

  const filteredPlayers = players.filter(
    (player) => !props.disabledPlayerIds?.includes(player.id!)
  );

  return (
    <div className="h-full w-full relative">
      <Command shouldFilter={false} className="w-full mt-2 bg-transparent text-white">
        <CommandInput
          className="text-white w-full"
          placeholder="Search Team..."
          value={searchQuery ? searchQuery : ''}
          onValueChange={(query: string) => handleSearchChange(query ? query : '')}
        />

        <CommandList className="absolute w-full max-h-60 mt-14 bg-white text-black shadow-lg z-10">
          {loading && <CommandEmpty>Loading Players...</CommandEmpty>}
          {!loading && filteredPlayers.length === 0 && <CommandEmpty>No Player found.</CommandEmpty>}
          {isDropdownVisible && (
            <CommandGroup>
              {filteredPlayers.map((player) =>
                player ? (
                  <CommandItem key={player.id} value={player.id!} onSelect={() => handleSelect(player.id!)}>
                    <div className="flex gap-2 items-center">
                      <img
                        src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <span className="text-black">{player.name}</span>
                      </div>
                    </div>
                  </CommandItem>
                ) : null,
              )}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
