import { PlayerTeamCard } from "./playerTeamCard";
import { Player, PointType, TeamDetails } from "@/stores/types";

interface PlayerTeamManageProps {
    team1: TeamDetails;
    team2: TeamDetails;
    onTeamClick: (teamIndex: number) => void;
    onPlayerSelect: (player: Player, playerIndex: number, teamIndex: number) => void;
    matchId: string | null;
    team1SetScore: number;
    team2SetScore: number;
    activeTurnPointTypes: PointType[];
    activeTurnScore: number;
}

export function PlayerTeamManager(props: PlayerTeamManageProps) {
    const handlePlayerConfirm = (player: Player, playerIndex: number, teamIndex: number) => {
        props.onPlayerSelect(player, playerIndex, teamIndex);
    };

    return (
        <div className="w-full container">
            <div className="grid grid-cols-2 gap-5 w-full">
                <PlayerTeamCard activeTurnScore={props.activeTurnScore} activeTurnPointTypes={props.activeTurnPointTypes} teamSetScore={props.team1SetScore} onPlayerTeamCardSelect={() => props.onTeamClick(0)} onPlayerConfirm={(player, index) => handlePlayerConfirm(player, index, 0)} data={props.team1} matchId={props.matchId} />
                <PlayerTeamCard activeTurnScore={props.activeTurnScore} activeTurnPointTypes={props.activeTurnPointTypes} teamSetScore={props.team2SetScore} onPlayerTeamCardSelect={() => props.onTeamClick(1)} onPlayerConfirm={(player, index) => handlePlayerConfirm(player, index, 1)} data={props.team2} matchId={props.matchId} />
            </div>
        </div>
    )
}