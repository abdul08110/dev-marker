import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import { TournamentTeam } from '@/stores/types';

interface TournamentItemCardProps {
  noOfGamesScheduled: number;
  teamOne: TournamentTeam;
  teamTwo: TournamentTeam;
  phaseName: string;
  dateScheduled: string;
  onShowGamesAndLineup: () => void;
}

export function TournamentItemCard({
  noOfGamesScheduled,
  teamOne,
  teamTwo,
  phaseName,
  dateScheduled,
  onShowGamesAndLineup,
}: TournamentItemCardProps) {
  return (
    <Card className="w-full overflow-hidden border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer" onClick={onShowGamesAndLineup}>
      <CardContent className="p-0">
        <CardHeader className="pb-2 px-3 py-3 border-b border-slate-700">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                {noOfGamesScheduled} Games
              </span>
            </div>
            <div className="text-right flex gap-4">
              <span className="text-xs text-slate-300">{new Date(dateScheduled).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-xs text-slate-300">{phaseName}</span>
            </div>
          </CardTitle>
        </CardHeader>

        <div className="p-3">
          {/* Teams with logos */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            {/* Team One */}
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-slate-600">
                <AvatarImage src={teamOne.logo} />
                <AvatarFallback className="text-sm font-semibold">{teamOne.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-white font-semibold text-sm">{teamOne.name}</span>
              </div>
            </div>

            {/* Team Two */}
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-slate-600">
                <AvatarImage src={teamTwo.logo} />
                <AvatarFallback className="text-sm font-semibold">{teamTwo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-white font-semibold text-sm">{teamTwo.name}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <Button 
              variant="ghost" 
              onClick={onShowGamesAndLineup}
              className="w-full text-slate-300 hover:text-white hover:bg-slate-700 py-2"
            >
              <span className="flex items-center justify-center gap-2 text-sm">
                VIEW GAMES
                <ArrowRightCircle className="size-3" />
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
