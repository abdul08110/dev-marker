import SnookerAnimation from '@/animations/snooker';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';

interface ScoreUpdateLoadingProps {
  isModalOpen: boolean;
}

export function ScoreUpdateLoadingModal(props: ScoreUpdateLoadingProps) {
  return (
    <Dialog open={props.isModalOpen}>
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>

        <div className="flex flex-col justify-center items-center rounded-md overflow-hidden bg-lighterSecondary h-40 w-40 text-white">
            <SnookerAnimation />
          <p>Loading...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
