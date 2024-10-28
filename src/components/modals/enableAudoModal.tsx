import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  
  interface EnableAudioModal {
    isModalOpen: boolean;
    closeModal: () => void;
    confirmModal: () => void;
  }
  
  export function EnableAudioModal(props: EnableAudioModal) {
    return (
      <AlertDialog open={props.isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Enable Audio for Video?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={props.closeModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={props.confirmModal}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  