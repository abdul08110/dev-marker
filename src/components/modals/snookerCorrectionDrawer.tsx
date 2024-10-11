import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { PlayerDetails } from '@/stores/types';
import { SnookerScoreCorrectionData, SnookerScoreCorrectionForm } from '../forms/app/snookerScoreCorrection';

interface SnookerCorrectionDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: SnookerScoreCorrectionData) => void;
  redsOnTable: number;
  teamOneScore: number;
  teamTwoScore: number;
  teamOne: PlayerDetails[];
  teamTwo: PlayerDetails[];
  maxReds: number;
}

export function SnookerScoreCorrectionDrawer(props: SnookerCorrectionDrawerProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-3/5">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">Score Correction</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-full">
          <SnookerScoreCorrectionForm
            teamOneName={props.teamOne.length === 1 ? `${props.teamOne[0].name}` : 'Team 1'}
            teamTwoName={props.teamTwo.length === 1 ? `${props.teamTwo[0].name}` : 'Team 2'}
            teamOneScore={props.teamOneScore}
            teamTwoScore={props.teamTwoScore}
            redsOnTable={props.redsOnTable}
            onSubmit={props.onSubmit}
            maxReds={props.maxReds}
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
