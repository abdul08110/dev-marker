'use client';

import * as React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useGetPlayers from '@/api/app/useGetPlayers';
import useGetPlayerById from '@/api/app/useGetPlayerById';
import { Player } from '@/stores/types';
import useDebounce from '@/hooks/useDebounce';
import { ScanQrCode } from 'lucide-react';
import { ScanPlayerQrModal } from '@/components/modals/ScanPlayerQrModal';
import { toast } from '@/components/ui/use-toast';

interface PlayersListProps {
  clubId: string;
  onPlayerSelect: (player: Player) => void;
  disabledPlayerList: (string | null)[];
}

export function PlayersList({ clubId, onPlayerSelect, disabledPlayerList }: PlayersListProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isQrModalOpen, setIsQrModalOpen] = React.useState<boolean>(false);
  const [isFetchingPlayer, setIsFetchingPlayer] = React.useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { getPlayers, players, loading, error } = useGetPlayers();
  const { getPlayerById, loading: loadingPlayerDetails } = useGetPlayerById();

  React.useEffect(() => {
    if (clubId) {
      getPlayers({ id: clubId });
    }
  }, [clubId]);

  React.useEffect(() => {
    if (debouncedSearchQuery.trim() !== '') {
      getPlayers({ id: clubId, search: debouncedSearchQuery });
    } else {
      getPlayers({ id: clubId });
    }
  }, [debouncedSearchQuery, clubId]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (currentValue: string) => {
    const player = players?.find((value) => value.id === currentValue);
    if (player) {
      onPlayerSelect(player);
    }
  };

  const handlePlayerFound = async (playerId: string) => {
    try {
      setIsFetchingPlayer(true);
      const playerData = await getPlayerById(playerId);
      if (playerData && playerData.result) {
        onPlayerSelect(playerData.result);
      } else {
        throw new Error('Failed to fetch player details');
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch player details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingPlayer(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full mt-2 mb-2">
        <button
          onClick={() => setIsQrModalOpen(true)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors ml-2"
          disabled={isFetchingPlayer}
        >
          <ScanQrCode className={`h-5 w-5 ${isFetchingPlayer ? 'text-gray-500' : 'text-white'}`} />
        </button>
      </div>
      <Command shouldFilter={false} className="w-full bg-transparent text-white">
        <CommandInput
          className="text-white w-full"
          placeholder="Search player..."
          value={searchQuery}
          onValueChange={handleSearchChange}
        />
        <CommandList>
          {loading && <CommandEmpty>Loading players...</CommandEmpty>}
          {error && <CommandEmpty>Error loading players</CommandEmpty>}
          {isFetchingPlayer && <CommandEmpty>Fetching player details...</CommandEmpty>}
          {!loading && !error && !isFetchingPlayer && players && players.length === 0 && <CommandEmpty>No player found.</CommandEmpty>}
          <CommandGroup>
            {players?.map((player) =>
              disabledPlayerList.includes(player.id) ? null : (
                <CommandItem 
                  key={player.id} 
                  value={player.id!} 
                  onSelect={() => handleSelect(player.id!)}
                  disabled={isFetchingPlayer}
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col justify-between">
                      <span className="text-white">{player.name}</span>
                      <small className="text-white/70">{player.phoneNumber}</small>
                    </div>
                  </div>
                </CommandItem>
              ),
            )}
          </CommandGroup>
        </CommandList>
      </Command>

      <ScanPlayerQrModal
        isOpen={isQrModalOpen}
        onCloseModal={() => setIsQrModalOpen(false)}
        onPlayerFound={handlePlayerFound}
        isLoading={loadingPlayerDetails || isFetchingPlayer}
      />
    </div>
  );
}
