import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import useTournamentSchedule from '@/hooks/useTournamentSchedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TournamentHeader } from '@/components/tournament/tournametHeader';
import { TournamentItemCard } from '@/components/tournament/tournamentItem';
import { TournamentItem } from '@/stores/types';
import { isToday, isFuture, parseISO } from 'date-fns';

export function Tournament() {
  const { loading, schedule } = useTournamentSchedule();

  if (loading || !schedule.length) {
    return <SnookerMarkingLoading />;
  }

  const isItemCompleted = (item: TournamentItem) => {
    return item.tournamentSubItems.every(
      subItem => subItem.teamWinningIndex !== undefined && subItem.teamWinningIndex !== null
    );
  };

  const todayItems = schedule.filter(item => {
    const itemDate = parseISO(item.startDate);
    return isToday(itemDate) && !isItemCompleted(item);
  });

  const upcomingItems = schedule.filter(item => {
    const itemDate = parseISO(item.startDate);
    return isFuture(itemDate) || (!isToday(itemDate) && !isItemCompleted(item));
  }).sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());

  const completedItems = schedule.filter(item => isItemCompleted(item));

  return (
    <div className="h-screen w-screen flex flex-col">
      <TournamentHeader 
        logo={schedule[0].tournament.logo} 
        name={schedule[0].tournament.name} 
      />

      <Tabs defaultValue="today" className="container bg-transparent py-6">
        <TabsList className="w-full grid grid-cols-3 bg-transparent mb-6">
          <TabsTrigger className='data-[state=active]:text-white text-white/50' value="today">Today</TabsTrigger>
          <TabsTrigger className='data-[state=active]:text-white text-white/50' value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger className='data-[state=active]:text-white text-white/50' value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayItems.map((item) => (
            <TournamentItemCard key={item.id} item={item} />
          ))}
          {todayItems.length === 0 && (
            <div className="text-center text-white/70">No matches scheduled for today</div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingItems.map((item) => (
            <TournamentItemCard key={item.id} item={item} />
          ))}
          {upcomingItems.length === 0 && (
            <div className="text-center text-white/70">No upcoming matches</div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedItems.map((item) => (
            <TournamentItemCard key={item.id} item={item} />
          ))}
          {completedItems.length === 0 && (
            <div className="text-center text-white/70">No completed matches</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
