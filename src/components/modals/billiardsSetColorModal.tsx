import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';

interface BilliardsBallSelectorModalProps {
  isModalOpen: boolean;
  handleButtonUpdate: (type: 'white' | 'yellow') => void;
}

export function BilliardsBallSelectorModal(props: BilliardsBallSelectorModalProps) {
  return (
    <Dialog open={props.isModalOpen}>
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>

        <div className="grid grid-cols-2 gap-4  justify-center items-center rounded-md overflow-hidden bg-lighterSecondary p-10 text-white">
          <Button
            className="p-4 h-18 w-18"
            onClick={() => props.handleButtonUpdate('white')}
            variant={'secondary'}
            type="button"
          >
            <img className="h-14 w-14 object-contain" src={'/images/white-ball.png'} />
          </Button>

          <Button className="p-4 h-18 w-18" variant={'secondary'} type="button">
            <img
              onClick={() => props.handleButtonUpdate('yellow')}
              className="h-14 w-14 object-contain"
              src={'/images/yellow-ball.png'}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
