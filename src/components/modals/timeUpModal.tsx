import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import clsx from 'clsx';
import { useEffect } from 'react';

interface TimerContinueModalProps {
  isModalOpen: boolean;
  rotate: boolean;
}

export function TimeUpModal(props: TimerContinueModalProps) {
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
      <AlertDialogContent className={
        clsx({
          '-rotate-90': props.rotate
        })
      }>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-6xl text-center">Time Over!</AlertDialogTitle>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
