import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface SnookerMenuDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showCorrection: boolean;
  showRerack: boolean;
  showConcedeFrame: boolean;
  showEndGame: boolean;
  onCorrection?: () => void;
  onRerack?: () => void;
  onConcedeFrame?: () => void;
  onEndGame?: () => void;
}

export function SnookerMenuDrawer(props: SnookerMenuDrawerProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-3/5">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">Menu</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-full">
          <div className="flex flex-col gap-2">
            {props.showCorrection && (
              <Button variant="select" className="p-1 border-b" onClick={props.onCorrection}>
                Correction
              </Button>
            )}
            {props.showRerack && (
              <Button variant="select" className="p-1" onClick={props.onRerack}>
                Re-rack
              </Button>
            )}
            {props.showConcedeFrame && (
              <Button variant="select" className="p-1" onClick={props.onConcedeFrame}>
                Concede Frame
              </Button>
            )}
            {props.showEndGame && (
              <Button variant="select" className="p-1" onClick={props.onEndGame}>
                End Game
              </Button>
            )}
          </div>
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