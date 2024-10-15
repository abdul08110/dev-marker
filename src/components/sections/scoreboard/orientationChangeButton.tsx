import { Button } from '@/components/ui/button';
import OrientationLogo from '@/icons/orientation';

interface OrientationChangeButtonProps {
  onChange: () => void;
}

export function OrientationChangeButton(props: OrientationChangeButtonProps) {
  return (
    <div className="fixed h-0 right-1 top-1">
      <Button onClick={props.onChange}>
        <OrientationLogo className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
