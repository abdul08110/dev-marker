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
import { useEffect } from 'react';

interface TimerContinueModalProps {
  isModalOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

export function TimerContinueModal(props: TimerContinueModalProps) {
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (props.isModalOpen) {
      audio = new Audio('/time-up.mp3');
      audio.play().catch((err) => console.error('Failed to play audio:', err));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
      }
    };
  }, [props.isModalOpen]);

  return (
    <AlertDialog open={props.isModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Time Over!</AlertDialogTitle>
          <AlertDialogDescription>
            Select Continue if you want to add 30 mins and continue scoring
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.onCancel}>EndGame</AlertDialogCancel>
          <AlertDialogAction onClick={props.onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
