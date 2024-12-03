import { Card } from '@/components/ui/card';
import { StreamingState } from '@/hooks/useStreaming';

interface PortraitStreamDataProps {
  state: StreamingState | null;
}

export function PortraitData(props: PortraitStreamDataProps) {
  if (!props.state) {
    return <></>;
  }

  return (
    <div className="flex-grow overflow-y-scroll flex flex-col px-4 py-4">
      <Card className="flex gap-4 border-0 p-2">
        <div className="flex flex-col gap-3">
          {props.state!.tournamentLogo && (
            <img
              className="h-12 w-12 rounded-full overflow-hidden"
              src={props.state!.teamOneLogo ? props.state!.teamOneLogo : '/images/user-dummy-pic.png'}
            />
          )}
          {props.state!.tournamentLogo === null && (
            <img
              className="h-12 w-12 rounded-full overflow-hidden"
              src={
                props.state!.sideOnePlayerOne.profilePhoto
                  ? props.state!.sideOnePlayerOne.profilePhoto
                  : '/images/user-dummy-pic.png'
              }
            />
          )}
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className='flex gap-2'>
            <div className='flex flex-col gap-2'></div>
            <div className='flex justify-center items-center font-bold text-white text-sm'>VS</div>
            <div className='flex flex-col gap-2'></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {props.state!.tournamentLogo && (
            <img
              className="h-12 w-12 rounded-full overflow-hidden"
              src={props.state!.teamTwoLogo ? props.state!.teamTwoLogo : '/images/user-dummy-pic.png'}
            />
          )}
          {props.state!.tournamentLogo === null && (
            <img
              className="h-12 w-12 rounded-full overflow-hidden"
              src={
                props.state!.sideTwoPlayerOne.profilePhoto
                  ? props.state!.sideTwoPlayerOne.profilePhoto
                  : '/images/user-dummy-pic.png'
              }
            />
          )}
        </div>
      </Card>
    </div>
  );
}
