import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';

interface goToScoreBoardOrMarkerViewProps {
  isModalOpen: boolean;
  matchId: string | null;
}

export function LiveMatchGoToScoreBoardOrMarkerModal(props: goToScoreBoardOrMarkerViewProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={props.isModalOpen}>
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>
        <div className="container">
          <div className="p-2 flex justify-center">
            <div className=" bg-[#1F1F1F]  rounded-lg shadow-xl">
              <h2 className="text-white text-center mt-4">Go to Live Match</h2>
              <div className="w-full p-4 grid grid-cols-2 gap-4 items-center justify-center h-56">
                <div
                  onClick={() => navigate(`/app/snooker?matchId=${props.matchId!}`)}
                  className="bg-[url('/images/snooker.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                >
                  <h3 className="text-white text-xl">Marker</h3>
                </div>
                <div
                  onClick={() => navigate('/app/billiyards')}
                  className="bg-[url('/images/billiards.png')] p-5 flex justify-center items-end aspect-[4/3] h-44 bg-cover rounded-lg w-full"
                >
                  <h3 className="text-white text-xl">Scoreboard</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
