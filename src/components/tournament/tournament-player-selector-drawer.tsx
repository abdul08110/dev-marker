'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { QrCode } from 'lucide-react';
import useGetTournamentPlayers from '@/api/app/useGetTournamentPlayers';
import useGetPlayerById from '@/api/app/useGetPlayerById';
import useAddPlayerToTournament from '@/api/app/useAddPlayerToTournament';
import { Player } from '@/stores/types';
import useDebounce from '@/hooks/useDebounce';
import { CustomQrModal } from '@/components/modals/customQrModal';
import { PlayerConfirmationModal } from '@/components/modals/playerConfirmationModal';
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

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { getPlayers, players, loading, error } = useGetTournamentPlayers();
  const { getPlayerById, loading: loadingPlayerDetails } = useGetPlayerById();
  const { addPlayerToTournament, loading: addingPlayer } = useAddPlayerToTournament();

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
                        src={player.profilePhoto ? player.profilePhoto : '/images/user-dummy-pic.png'}
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
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
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
    </>
  );
}
