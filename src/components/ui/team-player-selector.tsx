import { useEffect, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useGetTournamentPlayers from '@/api/app/useGetTournamentPlayers';
import useDebounce from '@/hooks/useDebounce';
import { Player } from '@/stores/types';
import { X } from 'lucide-react';

interface TeamSelectorProps {
  onChange: (player: Player) => void;
  teamId: string;
  value: Player;
  disabledPlayerIds?: string[];
}

export function TeamPlayerSelector(props: TeamSelectorProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { getPlayers, players, loading } = useGetTournamentPlayers();
  
  const hasSelectedPlayer = props.value && props.value.id;

  useEffect(() => {
    if (hasSelectedPlayer && props.value.name && !searchQuery) {
      setSearchQuery(props.value.name);
    }
  }, [props.value]);

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

    const shouldShowDropdown = 
      (debouncedSearchQuery.trim() !== '' && debouncedSearchQuery !== props.value?.name) || 
      (isFocused && !hasSelectedPlayer);
    
    setDropdownVisible(shouldShowDropdown);
  }, [debouncedSearchQuery, props.teamId, isFocused, props.value]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '' && hasSelectedPlayer) {
      props.onChange({
        id: '',
        name: '',
        phoneNumber: '',
        profilePhoto: null,
      });
    }
  };

  const handleSelect = (playerId: string) => {
    const player = players?.find((value) => value.id === playerId);
    if (player) {
      setSearchQuery(player.name);
      props.onChange(player);
      setDropdownVisible(false);
      setIsFocused(false);
    }
  };

  const handleClearSelection = () => {
    props.onChange({
      id: '',
      name: '',
      phoneNumber: '',
      profilePhoto: null,
    });
    setSearchQuery('');
    setDropdownVisible(true);
    setIsFocused(true);
  };

  const filteredPlayers = players.filter(
    (player) => !props.disabledPlayerIds?.includes(player.id!)
  );

  return (
    <div className="h-full w-full relative">
      {hasSelectedPlayer ? (
        <div className="flex items-center justify-between p-2 border rounded-md bg-slate-700 text-white">
          <div className="flex items-center gap-2">
            <img
              src={props.value.profilePhoto ? props.value.profilePhoto : '/images/user-dummy-pic.png'}
              className="h-8 w-8 rounded-full object-cover"
              alt={props.value.name}
            />
            <span>{props.value.name}</span>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-white hover:text-red-400 transition-colors"
            aria-label="Clear selection"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <Command shouldFilter={false} className="w-full mt-2 bg-transparent text-white">
          <CommandInput
            className="text-white w-full"
            placeholder="Search player..."
            value={searchQuery}
            onValueChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                if (!hasSelectedPlayer) {
                  setDropdownVisible(false);
                }
              }, 200);
            }}
          />

          {isDropdownVisible && (
            <CommandList className="absolute w-full max-h-60 mt-14 bg-white text-black shadow-lg z-10 rounded-md overflow-hidden">
              {loading && <CommandEmpty>Loading Players...</CommandEmpty>}
              {!loading && filteredPlayers.length === 0 && (
                <CommandEmpty>No players found</CommandEmpty>
              )}
              <CommandGroup>
                {filteredPlayers.map((player) =>
                  player ? (
                    <CommandItem 
                      key={player.id} 
                      value={player.id!} 
                      onSelect={() => handleSelect(player.id!)}
                      className="cursor-pointer hover:bg-slate-100"
                    >
                      <div className="flex gap-2 items-center py-1">
                        <img
                          src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
                          className="h-8 w-8 rounded-full object-cover"
                          alt={player.name}
                        />
                        <div className="flex flex-col justify-between">
                          <span className="text-black font-medium">{player.name}</span>
                          {player.phoneNumber && (
                            <span className="text-xs text-gray-500">{player.phoneNumber}</span>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ) : null
                )}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      )}
    </div>
  );
}
