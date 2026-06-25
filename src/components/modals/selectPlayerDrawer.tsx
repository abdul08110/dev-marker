import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Player, PlayerDetails } from '@/stores/types';
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
  showCancel: boolean;
  onBack: () => void;
  showBack: boolean;
  teamPlayers: PlayerDetails[];
  onRemovePlayer: (playerIndex: number) => void;
}

export function SelectPlayerDrawer(props: SelectPlayerPopoverProps) {
  const [addState, setAddState] = React.useState<'MEMBER' | 'GUEST'>('MEMBER');
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [stateModalOpen, setStateModalOpen] = React.useState<boolean>(false);

  const showAddModalAfterChangingMemeberType = (type: 'MEMBER' | 'GUEST') => {
    setAddState(type);
    setShowAddModal(true);
  };

  const handlePlayerConfirmation = (player: Player) => {
    setShowAddModal(false);
    setStateModalOpen(false);
    props.onSubmit(player);
  };

  const confirmedPlayers = props.teamPlayers
    .map((p, i) => ({ player: p, index: i }))
    .filter(({ player }) => player.id !== null);

  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-dvh">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">
            Select{' '}
            {props.noOfPlayersPerTeam === 1
              ? `Player ${props.teamIndex + 1}`
              : `Team ${props.teamIndex + 1} Player ${props.playerIndex + 1}`}
          </DrawerTitle>
          {confirmedPlayers.map(({ player, index }) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <img
                src={player.profilePhoto ?? '/images/user-dummy-pic.png'}
                className="h-7 w-7 rounded-full object-cover shrink-0"
              />
              <span className="text-sm text-white/80">
                <span className="text-white/50">Selected Player {index + 1}: </span>
                <span className="font-semibold">{player.name}</span>
              </span>
            </div>
          ))}
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

          {props.showCancel && (
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          )}
          {props.showBack && (
            <Button type={'button'} onClick={props.onBack} variant={'secondary'}>
              Back
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
