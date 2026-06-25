'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { QrCode } from 'lucide-react';
import useGetTournamentPlayers from '@/api/app/useGetTournamentPlayers';
import useGetPlayerById from '@/api/app/useGetPlayerById';
import useAddPlayerToTournament from '@/api/app/useAddPlayerToTournament';
import useTournamentTeamAddPlayers from '@/api/app/addTournamentTeamPlayer';
import useSearchPlayers from '@/api/app/useSearchPlayer';
import { Player } from '@/stores/types';
import useDebounce from '@/hooks/useDebounce';
import { CustomQrModal } from '@/components/modals/customQrModal';
import { PlayerConfirmationModal } from '@/components/modals/playerConfirmationModal';
import { AddPlayerModal } from '@/components/modals/addPlayerModal';
import { toast } from '@/components/ui/use-toast';

interface TournamentPlayerSelectorDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  teamId?: string;
  onPlayerSelect: (player: Player) => void;
  disabledPlayerList: (string | null)[];
  placeholder?: string;
  title?: string;
}

export function TournamentPlayerSelectorDrawer({
  open,
  onOpenChange,
  tournamentId,
  teamId,
  onPlayerSelect,
  disabledPlayerList,
  placeholder = 'Search player...',
  title = 'Select Player',
}: TournamentPlayerSelectorDrawerProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isQrModalOpen, setIsQrModalOpen] = React.useState<boolean>(false);
  const [scannedPlayer, setScannedPlayer] = React.useState<Player | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = React.useState<boolean>(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = React.useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { getPlayers, players, loading, error } = useGetTournamentPlayers();
  const { getPlayerById, loading: loadingPlayerDetails } = useGetPlayerById();
  const { addPlayerToTournament, loading: addingPlayer } = useAddPlayerToTournament();
  const { addTournamentTeamPlayer, loading: addingNewPlayer } = useTournamentTeamAddPlayers();
  const { getPlayers: searchPlayerByPhone } = useSearchPlayers();

  React.useEffect(() => {
    if (open && tournamentId) {
      getPlayers({ tournamentId, teamId });
    }
  }, [open, tournamentId, teamId]);

  React.useEffect(() => {
    if (debouncedSearchQuery.trim() !== '') {
      getPlayers({ tournamentId, teamId, search: debouncedSearchQuery });
    } else {
      getPlayers({ tournamentId, teamId });
    }
  }, [debouncedSearchQuery, tournamentId, teamId]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (currentValue: string) => {
    const player = players?.find((value) => value.id === currentValue);
    if (player) {
      onPlayerSelect(player);
      onOpenChange(false);
    }
  };

  const handleQrScan = async (playerId: string) => {
    try {
      const playerData = await getPlayerById(playerId);
      if (playerData && playerData.result) {
        // Check if player is already selected
        if (disabledPlayerList.includes(playerData.result.id!)) {
          toast({
            title: 'Player Already Selected',
            description: 'This player is already selected.',
            variant: 'destructive',
          });
          return;
        }

        setScannedPlayer(playerData.result);
        setShowConfirmationModal(true);
        setIsQrModalOpen(false);
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
    }
  };

  const handleConfirmPlayer = async () => {
    if (!scannedPlayer) return;

    try {
      const result = await addPlayerToTournament({
        playerId: scannedPlayer.id!,
        tournamentId,
        teamId,
      });

      if (result) {
        onPlayerSelect(scannedPlayer);
        setShowConfirmationModal(false);
        setScannedPlayer(null);
        onOpenChange(false);
      } else {
        throw new Error('Failed to add player to tournament');
      }
    } catch (error) {
      console.error('Error adding player to tournament:', error);
      toast({
        title: 'Error',
        description: 'Failed to add player to tournament. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelPlayer = () => {
    setShowConfirmationModal(false);
    setScannedPlayer(null);
  };

  const handleAddNewPlayer = async (data: { name: string; phoneNumber: string }) => {
    try {
      // If teamId is provided, use it, otherwise it's optional
      const result = await addTournamentTeamPlayer({
        phone: data.phoneNumber,
        name: data.name,
        tournamentId,
        teamId: teamId || '',
      });

      if (result) {
        // Search for the newly added player to get the full Player object
        const playerData = await searchPlayerByPhone({ phoneNumber: data.phoneNumber });

        if (playerData && playerData.result) {
          onPlayerSelect(playerData.result);
          setIsAddPlayerModalOpen(false);
          onOpenChange(false);
        } else {
          throw new Error('Failed to fetch player details after adding');
        }
      } else {
        throw new Error('Failed to add player to tournament');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: 'Error',
        description: 'Failed to add player. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="border-0 h-full">
          <DrawerHeader className="text-left text-white">
            <DrawerTitle className="text-2xl">{title}</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 h-[70%]">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsQrModalOpen(true)}
                className="h-10 w-10 p-1 text-white border-white/20 hover:bg-white/10"
              >
                <QrCode className="h-full w-full" />
              </Button>
            </div>

            <div className="max-h-full overflow-y-auto">
              {loading && <div className="text-white text-center py-4">Loading players...</div>}
              {error && <div className="text-white text-center py-4">Error loading players</div>}
              {!loading && !error && players && players.length === 0 && (
                <div className="text-white text-center py-4">No player found.</div>
              )}

              <div className="space-y-2">
                {players?.map((player) =>
                  disabledPlayerList.includes(player.id) ? null : (
                    <div
                      key={player.id}
                      className="flex gap-2 items-center p-3 rounded-md hover:bg-white/10 cursor-pointer"
                      onClick={() => handleSelect(player.id!)}
                    >
                      <img
                        src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.jpg'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <span className="text-white">{player.name}</span>
                        <small className="text-white/70">{player.phoneNumber}</small>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button type="button" onClick={() => setIsAddPlayerModalOpen(true)} disabled={addingNewPlayer}>
                Add Player
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <CustomQrModal
        isOpen={isQrModalOpen}
        onCloseModal={() => setIsQrModalOpen(false)}
        onPlayerFound={handleQrScan}
        isLoading={loadingPlayerDetails}
      />

      <PlayerConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelPlayer}
        onConfirm={handleConfirmPlayer}
        player={scannedPlayer}
        loading={addingPlayer}
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onSubmit={handleAddNewPlayer}
        loading={addingNewPlayer}
      />
    </>
  );
}
