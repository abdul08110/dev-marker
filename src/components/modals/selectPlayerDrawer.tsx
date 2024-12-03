import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Player } from '@/stores/types';
import { PlayersList } from '../sections/scoring/playersList';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
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
  const [addState, setAddState] = React.useState<'MEMBER' | 'GUEST'>('MEMBER');
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [stateModalOpen, setStateModalOpen] = React.useState<boolean>(false);

  const showAddModalAfterChangingMemeberType = async (type: 'MEMBER' | 'GUEST') => {
    await setAddState(type);
    await setShowAddModal(true);
  };

  const handlePlayerConfirmation = async (player: Player) => {
    await setShowAddModal(false);
    await setStateModalOpen(false);

    await props.onSubmit(player);
  };

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
        <div className="px-4 h-[70%]">
          <PlayersList
            disabledPlayerList={props.disabledPlayerList}
            onPlayerSelect={props.onSubmit}
            clubId={props.clubId}
          />
        </div>

        <DrawerFooter className="pt-2">
          <Dialog
            open={stateModalOpen}
            onOpenChange={(value) => {
              if (value === false) setStateModalOpen(false);
            }}
          >
            <Button onClick={() => setStateModalOpen(true)} className="w-full" variant={'default'}>
              Add Player
            </Button>

            <DialogContent className="absolute transform -translate-y-1/2 top-1/2 left-0 w-full">
              <DialogTitle></DialogTitle>
              <div className="container">
                <div className="p-2 flex justify-center">
                  <div className="w-full bg-[#1F1F1F] p-4 grid grid-cols-2 gap-4 items-center justify-center rounded-lg h-56 shadow-xl">
                    <div
                      onClick={() => showAddModalAfterChangingMemeberType('MEMBER')}
                      className="bg-[url('/images/snooker.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                    >
                      <h3 className="text-white text-xl">MEMBER</h3>
                    </div>
                    <div
                      onClick={() => showAddModalAfterChangingMemeberType('GUEST')}
                      className="bg-[url('/images/billiards.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                    >
                      <h3 className="text-white text-xl">GUEST</h3>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <PlayerSearchModal
            onCloseModal={() => {
              setShowAddModal(false);
              setStateModalOpen(false);
            }}
            isOpen={showAddModal}
            type={addState}
            onPlayerConfirm={handlePlayerConfirmation}
            clubId={props.clubId}
          />
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
