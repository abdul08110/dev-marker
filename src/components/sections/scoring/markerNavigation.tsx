import BreaksLogo from "@/icons/breaks";
import MatchLogo from "@/icons/match";
import StatsLogo from "@/icons/stats";
import { TabsTrigger } from "@radix-ui/react-tabs";
import clsx from 'clsx';

export function MarkerNavigation() {
    const tabTriggerClassName = clsx(
        "col-span-1 bg-transparent p-0 flex flex-col justify-center items-center outline-0 border-0 focus:outline-none",
        "data-[state=active]:text-white text-white/50"
    );

    return (
        <div className="w-full py-5">
            <div className="container">
                <nav className="bg-black rounded-lg py-5 grid grid-cols-3 w-full">
                    <TabsTrigger value="scoring" className={tabTriggerClassName}>
                        <MatchLogo className="h-5 w-5" />
                        <small>Match</small>
                    </TabsTrigger>
                    <TabsTrigger value="stats" className={tabTriggerClassName}>
                        <StatsLogo className="h-5 w-5" />
                        <small>Stats</small>
                    </TabsTrigger>
                    <TabsTrigger value="breaks" className={tabTriggerClassName}>
                        <BreaksLogo className="h-5 w-5" />
                        <small>Breaks</small>
                    </TabsTrigger>
                </nav>
            </div>
        </div>
    );
}