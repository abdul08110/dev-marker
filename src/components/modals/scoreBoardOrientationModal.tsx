import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  
  interface ScoreBoardOrientationModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    confirmModal: () => void;
  }
  
  export function ScoreBoardOrientationModal(props: ScoreBoardOrientationModalProps) {
    return (
      <AlertDialog open={props.isModalOpen}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Do you want to switch to portrait Mode?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={props.closeModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={props.confirmModal}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  