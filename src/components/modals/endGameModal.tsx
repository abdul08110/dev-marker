import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EndGameModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  confirmModal: () => void;
}

export function EndGameModal(props: EndGameModalProps) {
  return (
    <AlertDialog open={props.isModalOpen}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to end the game?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.confirmModal}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
