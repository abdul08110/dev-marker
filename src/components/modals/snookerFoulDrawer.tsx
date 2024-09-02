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
import { SnookerFoulData, SnookerFoulForm } from "../forms/app/snookerFoul"
import { PlayerDetails } from "@/stores/types";

interface SnookerFoulDrawerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: SnookerFoulData) => void;
    redsOnTable: number;
    foulByPlayerName: PlayerDetails | null;
}

export function SnookerFoulDrawer(props: SnookerFoulDrawerProps) {
    return (
        <Drawer  open={props.open} onOpenChange={props.setOpen}>
            <DrawerContent className="border-0 h-3/5">
                <DrawerHeader className="text-left text-white">
                    <DrawerTitle className="text-2xl">Foul by {props.foulByPlayerName?.playerName}</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 h-full">
                    <SnookerFoulForm redsOnTable={props.redsOnTable} onSubmit={props.onSubmit} />
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
