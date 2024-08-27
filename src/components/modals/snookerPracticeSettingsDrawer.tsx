import * as React from "react"
import { Button } from "@/components/ui/button"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { SnookerPracticeSettingsData, SnookerPracticeSettingsForm } from "../forms/app/snookerPracticeSettings";

interface SnookerMarkerSettingsDrawerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: SnookerPracticeSettingsData) => void;
}

export function SnookerPracticeSettingsDrawer(props: SnookerMarkerSettingsDrawerProps) {
    return (
        <Drawer  open={props.open} onOpenChange={props.setOpen}>
            <DrawerContent className="border-0 h-full">
                <DrawerHeader className="text-left text-white">
                    <DrawerTitle className="text-2xl">Settings</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 h-full">
                    <SnookerPracticeSettingsForm onSubmit={props.onSubmit} />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
