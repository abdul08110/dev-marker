'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Player } from '@/stores/types';
import { TournamentPlayerSelectorDrawer } from './tournament-player-selector-drawer';

interface TournamentPlayerSelectorProps {
  tournamentId: string;
  teamId?: string;
  onPlayerSelect: (player: Player) => void;
  disabledPlayerList: (string | null)[];
  placeholder?: string;
  title?: string;
  selectedPlayer?: Player | null;
}

export function TournamentPlayerSelector({ 
  tournamentId,
  teamId,
  onPlayerSelect, 
  disabledPlayerList, 
  placeholder = "Search player...",
  title = "Select Player",
  selectedPlayer
}: TournamentPlayerSelectorProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-start text-left font-normal text-white border-white/20 hover:bg-white/10"
      >
        {selectedPlayer ? (
          <div className="flex items-center gap-2 w-full">
            <img
              src={selectedPlayer.profilePhoto ? selectedPlayer.profilePhoto : '/images/user-dummy-pic.png'}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="flex-1">{selectedPlayer.name}</span>
          </div>
        ) : (
          <span className="text-white/70">{placeholder}</span>
        )}
      </Button>

      <TournamentPlayerSelectorDrawer
        open={open}
        onOpenChange={setOpen}
        tournamentId={tournamentId}
        teamId={teamId}
        onPlayerSelect={onPlayerSelect}
        disabledPlayerList={disabledPlayerList}
        placeholder={placeholder}
        title={title}
      />
    </div>
  );
} 