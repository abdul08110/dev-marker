import useLogout from '@/api/auth/useLogout';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import useMarkerClubs from '@/api/home/useMarkerClubs';
import { HomeLoading } from '@/components/loading/homeLoading';
import { LiveMatchGoToScoreBoardOrMarkerModal } from '@/components/modals/liveMatchGoToScoreBoardOrMarkerModal';
import TvLogo from '@/icons/tv';
import { setActiveClub, setClubs } from '@/stores/slices/clubSlice';
import { resetStateSnooker } from '@/stores/slices/sportSlice';
import { clearUndoStack } from '@/stores/slices/undoSlice';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const dispatch = useDispatch();
  const { getMarkerClubs, data } = useMarkerClubs('MARKER');
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveMatchModalOpen, setIsLiveMatchModalOpen] = useState<boolean>(false);
  const [liveMatchId, setLiveMatchId] = useState<string | null>(null);
  const [liveSport, setLiveSport] = useState<'BILLIARDS' | 'SNOOKER' | null>(null);
  const { logout } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetStateSnooker());
    dispatch(clearUndoStack());
    const fetchData = async () => {
      const result = await getMarkerClubs();
      if (result) {
        const formattedData = result.map((value) => ({
          clubId: value.club.id,
          venueId: value.venue.id,
        }));

        dispatch(setClubs(formattedData));
        dispatch(setActiveClub(formattedData[0]));

        const liveMatchByVenueResponse = await getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(
          formattedData[0].venueId,
        );

        if (liveMatchByVenueResponse && liveMatchByVenueResponse.matchId !== null) {
          setLiveMatchId(liveMatchByVenueResponse.matchId);
          setLiveSport(liveMatchByVenueResponse.sport);
          setIsLiveMatchModalOpen(true);
        }

        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <HomeLoading />;
  } else {
    return (
      <section className="h-screen w-screen relative overflow-y-scroll">
        <div className="flex flex-col h-full">
          <div className="bg-black h-24">
            <div className="container h-full w-full py-6">
              <div className="flex justify-between h-full">
                <div className="flex gap-2">
                  <img className="w-16 h-auto object-contain" src={data![0].club.imageUrl} />

                  <div className="flex flex-col justify-between h-full">
                    <h3 className="text-white text-xl">{data![0].club.name}</h3>
                    <small className="text-muted/50">Table No {data![0].venue.no}</small>
                  </div>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <div onClick={() => navigate('/app/scoreboard')} className="flex cursor-pointer">
                    <TvLogo className="h-6 w-auto" />
                  </div>
                  <img onClick={logout} className="w-6 h-auto object-contain cursor-pointer" src="/images/logout.png" />
                </div>
              </div>
            </div>
          </div>

          <div className="container py-10 flex flex-col gap-6 justify-start">
            <Dialog>
              <DialogTrigger className="p-0 bg-transparent border-0">
                <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
                  <h3 className="text-white text-xl">PRACTICE</h3>
                </div>
              </DialogTrigger>
              <DialogContent className="absolute transform -translate-y-1/2 top-1/2 left-0 w-full">
                <DialogTitle></DialogTitle>

                <div className="container">
                  <div className="p-2 flex justify-center">
                    <div className="w-full bg-[#1F1F1F] p-4 grid grid-cols-2 gap-4 items-center justify-center rounded-lg h-56 shadow-xl">
                      <div
                        onClick={() => navigate('/app/snooker')}
                        className="bg-[url('/images/snooker.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                      >
                        <h3 className="text-white text-xl">SNOOKER</h3>
                      </div>
                      <div
                        onClick={() => navigate('/app/billiards')}
                        className="bg-[url('/images/billiards.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                      >
                        <h3 className="text-white text-xl">BILLIARDS</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
              <h3 className="text-white text-xl">BOOKINGS</h3>
            </div>

            <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
              <h3 className="text-white text-xl">TOURNAMENT</h3>
            </div>
          </div>
        </div>
        <LiveMatchGoToScoreBoardOrMarkerModal sport={liveSport} matchId={liveMatchId} isModalOpen={isLiveMatchModalOpen} />
      </section>
    );
  }
}
