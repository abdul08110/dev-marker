import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Player } from '@/stores/types';
import { PlayersList } from '../sections/scoring/playersList';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { PlayerSearchModal } from './playerSearchModal';

interface SelectPlayerPopoverProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (value: Player) => void;
  disabledPlayerList: (string | null)[];
  clubId: string;
  teamIndex: number;
  playerIndex: number;
  noOfPlayersPerTeam: number;
}

export function SelectPlayerDrawer(props: SelectPlayerPopoverProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-full">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">
            Select{' '}
            {props.noOfPlayersPerTeam === 1
              ? `Player ${props.teamIndex + 1}`
              : `Team ${props.teamIndex + 1} Player ${props.playerIndex + 1}`}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-full">
          <PlayersList
            disabledPlayerList={props.disabledPlayerList}
            onPlayerSelect={props.onSubmit}
            clubId={props.clubId}
          />
        </div>

        <DrawerFooter className="pt-2">
          <Dialog>
            <DialogTrigger className="p-0 bg-transparent">
              <Button className="w-full" variant={'default'}>
                Add Player
              </Button>
            </DialogTrigger>
            <PlayerSearchModal onPlayerConfirm={props.onSubmit} />
          </Dialog>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
