import BreaksLogo from "@/icons/breaks";
import MatchLogo from "@/icons/match";
import StatsLogo from "@/icons/stats";
import { TabsTrigger } from "@radix-ui/react-tabs";

export function MarkerNavigation() {
    return (
        <div className="w-full">
            <div className="container">
                <nav className="bg-black rounded-lg py-5 grid grid-cols-3">
                    <TabsTrigger  value="scoring" className="col-span-1 bg-transparent p-0 flex flex-col justify-center items-center data-[state=active]:text-white text-white/50 outline-0">
                        <MatchLogo className="h-5 w-5" />
                        <small>Match</small>
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="col-span-1 bg-transparent p-0 flex flex-col justify-center items-center data-[state=active]:text-white text-white/50 outline-0">
                        <StatsLogo className="h-5 w-5" />
                        <small>Stats</small>
                    </TabsTrigger>
                    <TabsTrigger value="breaks" className="col-span-1 bg-transparent p-0 flex flex-col justify-center items-center data-[state=active]:text-white text-white/50 outline-0">
                        <BreaksLogo className="h-5 w-5" />
                        <small>Breaks</small>
                    </TabsTrigger>
                </nav>
            </div>
        </div>
    )
}