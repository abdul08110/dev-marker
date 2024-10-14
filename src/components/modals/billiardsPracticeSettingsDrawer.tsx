import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { BilliardsPracticeSettingsData, BilliardsPracticeSettingsForm } from '../forms/app/billiardsPracticeSettings';

interface BilliardsPracticeSettingsDrawer {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: BilliardsPracticeSettingsData) => void;
}

export function BilliardsPracticeSettingsDrawer(props: BilliardsPracticeSettingsDrawer) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="border-0 h-full">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">Settings</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-full">
          <BilliardsPracticeSettingsForm onSubmit={props.onSubmit} />
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
