import useLogout from '@/api/auth/useLogout';
import useCheckVersionOfPwa from '@/api/home/useCheckVersion';
import useGetActiveTournaments from '@/api/home/useGetActiveTournaments';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import useMarkerClubs from '@/api/home/useMarkerClubs';
import { HomeLoading } from '@/components/loading/homeLoading';
import { LiveMatchGoToScoreBoardOrMarkerModal } from '@/components/modals/liveMatchGoToScoreBoardOrMarkerModal';
import TvLogo from '@/icons/tv';
import { setActiveClub, setClubs } from '@/stores/slices/clubSlice';
import { resetStateSnooker, resetStateBilliards } from '@/stores/slices/sportSlice';
import { clearUndoStack } from '@/stores/slices/undoSlice';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { ScanQrModal } from '@/components/modals/scanQrModal';
import { RootState } from '@/stores';
import useInitiateScoreboardEntry from '@/api/app/useInitiateScoreboardEntry';

type PracticeStep = 'sport' | 'count';
type SportChoice = 'snooker' | 'billiards';
type CountChoice = 2 | 4;

export function Home() {
  const dispatch = useDispatch();
  const activeClub = useSelector((state: RootState) => state.club.activeClub);
  const { getMarkerClubs, data } = useMarkerClubs('MARKER');
  const { getTournaments, tournaments } = useGetActiveTournaments();
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
  const { checkVersion, version } = useCheckVersionOfPwa();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveMatchModalOpen, setIsLiveMatchModalOpen] = useState<boolean>(false);
  const [liveMatchId, setLiveMatchId] = useState<string | null>(null);
  const [liveSport, setLiveSport] = useState<'BILLIARDS' | 'SNOOKER' | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [venueId, setVenueId] = useState<string>('');

  // Practice match multi-step state
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [practiceStep, setPracticeStep] = useState<PracticeStep>('sport');

  const { logout } = useLogout();
  const navigate = useNavigate();
  const { initiateScoreboardEntry } = useInitiateScoreboardEntry();

  const openPracticeDialog = () => {
    setPracticeStep('sport');
    setPracticeDialogOpen(true);
  };

  const handleSportChoice = (sport: SportChoice) => {
    dispatch(clearUndoStack());
    if (sport === 'snooker') {
      dispatch(resetStateSnooker());
      setPracticeStep('count');
    } else {
      dispatch(resetStateBilliards());
      setPracticeDialogOpen(false);
      if (activeClub) {
        initiateScoreboardEntry({ venueId: activeClub.venueId, playerCount: 2, sport: 'billiards' });
      }
      navigate('/app/billiards?playerCount=2');
    }
  };

  const handleCountChoice = (count: CountChoice) => {
    setPracticeDialogOpen(false);
    if (activeClub) {
      initiateScoreboardEntry({ venueId: activeClub.venueId, playerCount: count, sport: 'snooker' });
    }
    navigate(`/app/snooker?playerCount=${count}`);
  };

  useEffect(() => {
    dispatch(resetStateSnooker());
    dispatch(clearUndoStack());
  
    const fetchData = async () => {
      const result = await getMarkerClubs();
      if (result) {
        const formattedData = result.map((value) => ({
          clubId: value.club.id,
          venueId: value.venue.id,
          clubName: value.club.name,
          clubLogo: value.club.imageUrl,
          venueNo: value.venue.no,
        }));

        dispatch(setClubs(formattedData));
        dispatch(setActiveClub(formattedData[0]));
        setVenueId(formattedData[0].venueId);

        await getTournaments();

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

    const checkVersionOfPWA = async () => {
      const res = await checkVersion();

      if (res === true) {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          registrations.forEach((registration) => {
            registration.unregister();
          });
        }
        window.location.reload();
      }
    };

    checkVersionOfPWA();
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
                <div className="flex gap-2 items-center">
                  <img className="w-16 h-auto object-contain" src={data![0].club.imageUrl} />

                  <div className="flex flex-col justify-center h-full">
                    <h3 className="text-white text-xl">{data![0].club.name}</h3>
                    <small className="text-muted/50">Table No {data![0].venue.no}</small>
                    <small className="text-muted/50">{version && version}</small>
                  </div>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <Smartphone onClick={() => setIsQrModalOpen(true)} className="size-6 text-white" />
                  <div onClick={() => navigate('/app/scoreboard')} className="flex cursor-pointer">
                    <TvLogo className="h-6 w-auto" />
                  </div>
                  <img onClick={logout} className="w-6 h-auto object-contain cursor-pointer" src="/images/logout.png" />
                </div>
              </div>
            </div>
          </div>

          <div className="container py-10 flex flex-col gap-6 justify-start">
            {/* Practice match — multi-step dialog */}
            <div onClick={openPracticeDialog} className="cursor-pointer">
              <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
                <h3 className="text-white text-xl">PRACTICE</h3>
              </div>
            </div>

            <Dialog open={practiceDialogOpen} onOpenChange={setPracticeDialogOpen}>
              <DialogContent className="absolute transform -translate-y-1/2 top-1/2 left-0 w-full">
                <DialogTitle></DialogTitle>
                <div className="container">
                  <div className="p-2 flex justify-center">
                    {practiceStep === 'sport' && (
                      <div className="w-full bg-[#1F1F1F] p-4 grid grid-cols-2 gap-4 items-center justify-center rounded-lg h-56 shadow-xl">
                        <div
                          onClick={() => handleSportChoice('snooker')}
                          className="bg-[url('/images/snooker.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full cursor-pointer"
                        >
                          <h3 className="text-white text-xl">SNOOKER</h3>
                        </div>
                        <div
                          onClick={() => handleSportChoice('billiards')}
                          className="bg-[url('/images/billiards.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full cursor-pointer"
                        >
                          <h3 className="text-white text-xl">BILLIARDS</h3>
                        </div>
                      </div>
                    )}

                    {practiceStep === 'count' && (
                      <div className="w-full bg-[#1F1F1F] p-6 flex flex-col gap-4 rounded-lg shadow-xl">
                        <h3 className="text-white text-lg font-semibold text-center">Number of Players</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleCountChoice(2)}
                            className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-8 transition-colors"
                          >
                            <span className="text-white text-4xl font-bold">2</span>
                            <span className="text-gray-300 text-sm">Singles</span>
                          </button>
                          <button
                            onClick={() => handleCountChoice(4)}
                            className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-8 transition-colors"
                          >
                            <span className="text-white text-4xl font-bold">4</span>
                            <span className="text-gray-300 text-sm">Doubles</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setPracticeStep('sport')}
                          className="text-gray-400 text-sm text-center mt-1 hover:text-white transition-colors"
                        >
                          ← Back
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
              <h3 className="text-white text-xl">BOOKINGS</h3>
            </div> */}

            <Dialog>
              <DialogTrigger className="p-0 bg-transparent border-0">
                <div className="bg-[url('/images/practice-match.png')] p-5 flex justify-center items-end aspect-[4/3] h-56 bg-cover rounded-lg w-full">
                  <h3 className="text-white text-xl">TOURNAMENT</h3>
                </div>
              </DialogTrigger>
              <DialogContent className="absolute transform -translate-y-1/2 top-1/2 left-0 w-full">
                <DialogTitle></DialogTitle>

                <div className="container">
                  <div className="p-2 flex justify-center">
                    <div className="w-full bg-[#1F1F1F] p-4 flex flex-col items-center gap-4 rounded-xl shadow-xl">
                      {tournaments && tournaments.length > 0 ? (
                        tournaments.map((value) => (
                          <div key={value.id} className="flex justify-center" onClick={() => navigate(`/app/tournament?tournamentId=${value.id}`)}>
                            <img src={value.logo} className="h-56 w-auto object-contain rounded-xl overflow-hidden" />
                          </div>
                        ))
                      ) : (
                        <div>No Results Found</div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {version && <small className="text-white">{version}</small>}
          </div>
        </div>
        <ScanQrModal venueId={venueId} isOpen={isQrModalOpen} onCloseModal={() => setIsQrModalOpen(false)} />
        <LiveMatchGoToScoreBoardOrMarkerModal
          sport={liveSport}
          matchId={liveMatchId}
          isModalOpen={isLiveMatchModalOpen}
        />
      </section>
    );
  }
}
