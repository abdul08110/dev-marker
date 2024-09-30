import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../../ui/button';
import settingsIcon from '@/assets/settings.svg';

interface ScoringHeaderProps {
  onBackClick: () => void;
  onSettingsClick: () => void;
}

export function ScoringHeader(props: ScoringHeaderProps) {
  return (
    <div className="bg-black">
      <div className="flex justify-between container py-5">
        <Popover>
          <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90">
            Menu
          </PopoverTrigger>
          <PopoverContent className="p-2 bg-transparent border-0">
            <div className="flex flex-col gap-2">
              <Button variant={'select'} className="p-1 border-b">
                Correction
              </Button>
              <Button variant={'select'} className="p-1">
                Re-rack
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={props.onSettingsClick} className="flex gap-2 justify-center items-center">
          <img src={settingsIcon} />
          Settings
        </Button>
      </div>
    </div>
  );
}
