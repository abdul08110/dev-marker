import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TournamentSubItem, TournamentFormat, TournamentTeam } from '@/stores/types';

interface TournamentSubItemCardProps {
  subItem: TournamentSubItem;
  format: TournamentFormat;
  dateScheduled: string;
  teamOnePlayers: string[];
  teamTwoPlayers: string[];
  teamOne: TournamentTeam;
  teamTwo: TournamentTeam;
  onStartMatch: () => void;
}

export function TournamentSubItemCard({
  format,
  teamOnePlayers,
  teamTwoPlayers,
  teamOne,
  teamTwo,
  onStartMatch
}: TournamentSubItemCardProps) {

  return (
    <Card className="w-full overflow-hidden border-slate-700 bg-slate-800">
      <CardContent className="p-0">
        <CardHeader className="pb-2 px-3 py-3 border-b border-slate-700">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">
                {format.name}
              </span>
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded uppercase">
                {format.sport.toLowerCase()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300">
                GAME NO #{format.matchNo}
              </div>
              <div className="text-xs text-slate-400 uppercase">
                {format.categoryName ? format.categoryName : format.name}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <div className="p-3 space-y-3">
          {/* Teams with logos and names */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team One */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={teamOne.logo} />
                  <AvatarFallback className="text-xs">{teamOne.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-300 truncate">{teamOne.name}</span>
              </div>
              <div className="space-y-1">
                {teamOnePlayers.length > 0 ? (
                  teamOnePlayers.map((player, index) => (
                    <div key={index} className="bg-slate-700 rounded px-2 py-1">
                      <span className="text-xs text-white">{player}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-700 rounded px-2 py-1">
                    <span className="text-xs text-slate-400">No players assigned</span>
                  </div>
                )}
              </div>
            </div>

            {/* Team Two */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={teamTwo.logo} />
                  <AvatarFallback className="text-xs">{teamTwo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-300 truncate">{teamTwo.name}</span>
              </div>
              <div className="space-y-1">
                {teamTwoPlayers.length > 0 ? (
                  teamTwoPlayers.map((player, index) => (
                    <div key={index} className="bg-slate-700 rounded px-2 py-1">
                      <span className="text-xs text-white">{player}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-700 rounded px-2 py-1">
                    <span className="text-xs text-slate-400">No players assigned</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Start Match Button */}
          <div className="pt-2 border-t border-slate-700">
            <Button 
              variant="default" 
              size="sm" 
              onClick={onStartMatch}
              disabled={teamOnePlayers.length === 0 || teamTwoPlayers.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2"
            >
              {teamOnePlayers.length === 0 || teamTwoPlayers.length === 0 ? 'Players Not Assigned' : 'Start Match'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
