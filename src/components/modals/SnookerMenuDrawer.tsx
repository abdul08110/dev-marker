import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SnookerMenuDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showCorrection: boolean;
  showRerack: boolean;
  showEndFrame: boolean;
  showConcedeFrame: boolean;
  showEndGame: boolean;
  onCorrection?: () => void;
  onRerack?: () => void;
  onConcedeFrame?: () => void;
  onEndGame?: () => void;
  onEndFrame?: () => void;
}

export function SnookerMenuDrawer(props: SnookerMenuDrawerProps) {
  const [showEndFrameAlert, setShowEndFrameAlert] = React.useState(false);
  const [showEndGameAlert, setShowEndGameAlert] = React.useState(false);

  const handleEndFrame = () => {
    setShowEndFrameAlert(false);
    props.setOpen(false);
    props.onEndFrame?.();
  };

  const handleEndGame = () => {
    setShowEndGameAlert(false);
    props.setOpen(false);
    props.onEndGame?.();
  };

  return (
    <>
      <Drawer open={props.open} onOpenChange={props.setOpen}>
        <DrawerContent className="border-0 h-3/5">
          <DrawerHeader className="text-left text-white">
            <DrawerTitle className="text-2xl">Menu</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 h-full">
            <div className="flex flex-col gap-2">
              {props.showCorrection && (
                <Button variant="select" type='button' className="p-1 border-b" onClick={props.onCorrection}>
                  Correction
                </Button>
              )}
              {props.showRerack && (
                <Button variant="select" type='button' className="p-1" onClick={props.onRerack}>
                  Re-rack
                </Button>
              )}
              {props.showConcedeFrame && (
                <Button variant="select" type='button' className="p-1" onClick={props.onConcedeFrame}>
                  Concede Frame
                </Button>
              )}
              {props.showEndFrame && (
                <Button variant="select" type='button' className="p-1 mt-8" onClick={() => setShowEndFrameAlert(true)}>
                  End Frame
                </Button>
              )}
              {props.showEndGame && (
                <Button variant="select" type='button' className="p-1 mt-8" onClick={() => setShowEndGameAlert(true)}>
                  End Match
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

      <AlertDialog open={showEndFrameAlert} onOpenChange={setShowEndFrameAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Do you want to end this Frame ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndFrame}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showEndGameAlert} onOpenChange={setShowEndGameAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Do you want to end this Match ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndGame}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
