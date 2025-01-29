import { TournamentItem, TournamentSubItem } from '@/stores/types';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TournamentPlayerHandicapSelectorSheet } from './tournamentPlayerHandipcapSelectorSheet';

interface TournamentItemProps {
  item: TournamentItem;
}

export function TournamentItemCard({ item }: TournamentItemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  useEffect(() => {
    console.log('Drawer open state:', isDrawerOpen);
  }, [isDrawerOpen]);

  const handleStartGame = (subItem: TournamentSubItem) => {
    setSelectedSubItem(subItem.id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSubItem(null);
  };

  const getMatchStatus = (subItem: TournamentSubItem) => {
    if (subItem.teamWinningIndex !== undefined && subItem.teamWinningIndex !== null) {
      return <span className="text-green-500 text-sm font-medium">Completed</span>;
    } else if (subItem.matchId) {
      return <span className="text-yellow-500 text-sm font-medium">Ongoing</span>;
    } else {
      return (
        <PlayCircle className="w-4 h-4" />
      );
    }
  };

  return (
    <>
      <Collapsible>
        <CollapsibleTrigger className="w-full p-4">
          <div className="flex flex-col gap-1 w-full p-1">
            <div className="text-white/70 text-xs text-right">{format(item.startDate, 'dd MMM yyyy')}</div>
            <div className="bg-[#1F1F1F] rounded-lg overflow-hidden flex items-center justify-between cursor-pointer p-3">
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={item.tournamentTeamOne.logo}
                    alt={item.tournamentTeamOne.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-white text-sm">{item.tournamentTeamOne.name}</span>
                </div>
                <span className="text-white/50 text-sm">vs</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{item.tournamentTeamTwo.name}</span>
                  <img
                    src={item.tournamentTeamTwo.logo}
                    alt={item.tournamentTeamTwo.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {item.tournamentSubItems
            .sort((a, b) => (a.matchNo || 0) - (b.matchNo || 0))
            .map((subItem) => (
              <div onClick={(e) => {
                e.stopPropagation();
                handleStartGame(subItem);
              }} key={subItem.id} className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-white/70 text-sm">{subItem.matchNo ? `Match #${subItem.matchNo}` : 'TBD'}</span>
                  <span className="text-white/50 text-sm">{subItem.format.name}</span>
                </div>
                {getMatchStatus(subItem)}
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>

      <TournamentPlayerHandicapSelectorSheet
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        tournamentItem={item}
        selectedTournamentSubItemId={selectedSubItem}
      />
    </>
  );
}
