import * as React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { BilliardsPracticeSettingsData, BilliardsPracticeSettingsForm } from '../forms/app/billiardsPracticeSettings';

interface BilliardsPracticeSettingsDrawer {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: BilliardsPracticeSettingsData) => void;
  teamOneLabel?: string;
  teamTwoLabel?: string;
  showBack?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

export function BilliardsPracticeSettingsDrawer(props: BilliardsPracticeSettingsDrawer) {
  const skipNextOnClose = React.useRef(false);

  const prevOpenRef = React.useRef(props.open);
  React.useEffect(() => {
    if (prevOpenRef.current && !props.open) {
      if (!skipNextOnClose.current && props.onClose) {
        props.onClose();
      }
      skipNextOnClose.current = false;
    }
    prevOpenRef.current = props.open;
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = (values: BilliardsPracticeSettingsData) => {
    skipNextOnClose.current = true;
    props.onSubmit(values);
  };

  const handleCancel = () => {
    skipNextOnClose.current = true;
    props.setOpen(false);
  };

  const handleBack = () => {
    skipNextOnClose.current = true;
    props.onBack?.();
  };

  const handleXClick = () => {
    props.setOpen(false);
  };

  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-full">
        <DrawerHeader className="text-left text-white relative">
          <DrawerTitle className="text-2xl">Settings</DrawerTitle>
          <button
            className="absolute top-3 right-4 text-white/60 hover:text-white"
            onClick={handleXClick}
          >
            <X size={22} />
          </button>
        </DrawerHeader>
        <div className="px-4 h-full overflow-y-auto">
          <BilliardsPracticeSettingsForm
            onSubmit={handleFormSubmit}
            teamOneLabel={props.teamOneLabel}
            teamTwoLabel={props.teamTwoLabel}
          />
        </div>
        <DrawerFooter className="pt-2">
          {props.showBack ? (
            <Button variant="secondary" onClick={handleBack}>Back</Button>
          ) : (
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
