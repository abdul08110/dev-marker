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

interface GoBackModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  confirmModal: () => void;
}

export function GoBackGameModal(props: GoBackModalProps) {
  return (
    <AlertDialog open={props.isModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to go back ? Match is in progress.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.confirmModal}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
