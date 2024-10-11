import { Button } from '../../ui/button';
import settingsIcon from '@/assets/settings.svg';

interface ScoringHeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
  onBackClick: () => void;
  onUndoClick: () => void;
  showUndo: boolean;
  showMenu: boolean;
}

export function ScoringHeader(props: ScoringHeaderProps) {
  return (
    <div className="bg-black">
      <div className="flex justify-between container py-5">
        {props.showMenu ? (
          <Button onClick={props.onMenuClick} className="flex gap-2 justify-center items-center">
            Menu
          </Button>
        ) : (
          <Button onClick={props.onBackClick} className="flex gap-2 justify-center items-center">
            Back
          </Button>
        )}

        {props.showUndo ? (
          <Button onClick={props.onUndoClick} className="flex gap-2 justify-center items-center">
            Undo
          </Button>
        ) : (
          <Button onClick={props.onSettingsClick} className="flex gap-2 justify-center items-center">
            <img src={settingsIcon} />
            Settings
          </Button>
        )}
      </div>
    </div>
  );
}
