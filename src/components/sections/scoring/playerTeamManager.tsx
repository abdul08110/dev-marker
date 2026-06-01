import { PlayerTeamCard } from './playerTeamCard';
import { SnookerPointType, TeamDetails } from '@/stores/types';

interface PlayerTeamManageProps {
  team1: TeamDetails;
  team2: TeamDetails;
  onTeamClick: (teamIndex: number) => void;
  onPlayerButtonClick: (playerIndex: number, teamIndex: number) => void;
  matchId: string | null;
  team1SetScore: number;
  team2SetScore: number;
  activeTurnPointTypes: {
    teamOne: SnookerPointType[][];
    teamTwo: SnookerPointType[][];
  };
  activeTurnScore: number;
  showBilliardsButtons: boolean;
}

function withOpponentFouls(
  ownTurns: SnookerPointType[][],
  opponentTurns: SnookerPointType[][],
): SnookerPointType[][] {
  const ownWithoutFoul = ownTurns.map((turn) => turn.filter((t) => t !== SnookerPointType.FOUL)).filter((turn) => turn.length > 0);
  const opponentFoulTurns = opponentTurns.map((turn) => turn.filter((t) => t === SnookerPointType.FOUL)).filter((turn) => turn.length > 0);
  return [...ownWithoutFoul, ...opponentFoulTurns];
}

export function PlayerTeamManager(props: PlayerTeamManageProps) {
  const team1DisplayTypes = withOpponentFouls(props.activeTurnPointTypes.teamOne, props.activeTurnPointTypes.teamTwo);
  const team2DisplayTypes = withOpponentFouls(props.activeTurnPointTypes.teamTwo, props.activeTurnPointTypes.teamOne);

  return (
    <div className="w-full container">
      <div className="grid grid-cols-2 gap-5 w-full">
        <PlayerTeamCard
          activeTurnScore={props.activeTurnScore}
          activeTurnPointTypes={team1DisplayTypes}
          teamSetScore={props.team1SetScore}
          onPlayerTeamCardSelect={() => props.onTeamClick(0)}
          onPlayerCardClick={(index) => props.onPlayerButtonClick(index, 0)}
          data={props.team1}
          showBilliardsBalls={props.showBilliardsButtons ? 'YELLOW' : null}
          matchId={props.matchId}
        />
        <PlayerTeamCard
          activeTurnScore={props.activeTurnScore}
          activeTurnPointTypes={team2DisplayTypes}
          teamSetScore={props.team2SetScore}
          onPlayerTeamCardSelect={() => props.onTeamClick(1)}
          onPlayerCardClick={(index) => props.onPlayerButtonClick(index, 1)}
          data={props.team2}
          matchId={props.matchId}
          showBilliardsBalls={props.showBilliardsButtons ? 'WHITE' : null}
        />
      </div>
    </div>
  );
}
