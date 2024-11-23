interface TopOverlayProps {
  clubLogo: string;
  tournamentLogo: string | null;
  venueNo: number;
}

export function TopOverlay(props: TopOverlayProps) {
  return (
    <div className="absolute inset-0 w-full flex justify-between lg:p-4 p-2 h-fit">
      <div className="flex flex-col gap-2 items-center h-fit">
        <img
          src="/images/clublogo.png"
          className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
        />
      </div>

      <div className="flex flex-col gap-2 items-center h-fit">
        <img src={props.clubLogo} className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 " />
        <small className="text-white font-medium lg:text-xl text-base xl:text-xl">T-{props.venueNo}</small>
        {props.tournamentLogo ? <img src={props.tournamentLogo!} className="lg:h-14 lg:w-auto h-8 w-auto" /> : <></>}
      </div>
    </div>
  );
}
