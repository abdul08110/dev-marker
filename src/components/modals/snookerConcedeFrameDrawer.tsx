import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { PlayerDetails } from '@/stores/types';
import { SnookerConcedeFrameData, SnookerConcedeFrameForm } from '../forms/app/snookerConcedeFrame';

interface SnookerConcedeFrameDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: SnookerConcedeFrameData) => void;
  teamOne: PlayerDetails[];
  teamTwo: PlayerDetails[];
}

export function SnookerScoreConcedeFrameDrawer(props: SnookerConcedeFrameDrawerProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-3/5">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">Concede Frame To</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-full">
          <SnookerConcedeFrameForm
            teamOneName={props.teamOne.length === 1 ? `${props.teamOne[0].name}` : 'Team 1'}
            teamTwoName={props.teamTwo.length === 1 ? `${props.teamTwo[0].name}` : 'Team 2'}
            onSubmit={props.onSubmit}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
