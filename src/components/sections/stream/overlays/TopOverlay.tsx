interface TopOverlayProps {
  clubLogo: string;
  tournamentLogo: string | null;
  venueNo: number;
  showOtherLogos?: boolean;
}

export function TopOverlay(props: TopOverlayProps) {
  return (
    <div className="absolute inset-0 w-full flex justify-between lg:p-4 p-2 h-fit">
      <div className="flex flex-col gap-2 items-center h-fit">
        <img
          src="/images/clublogo.png"
          className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
        />
        {props.showOtherLogos && (
          <>
            <img
              src="/images/logos/ksa.jpeg"
              className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
            <img
              src="/images/logos/liber.jpeg"
              className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
            <img
              src="/images/logos/progen.jpeg"
              className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center h-fit">
        <img src={props.clubLogo} className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden" />
        <small className="text-white font-medium lg:text-xl text-base xl:text-xl">T-{props.venueNo}</small>
        {props.tournamentLogo ? (
          <img
            src={props.tournamentLogo!}
            className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
          />
        ) : (
          <></>
        )}

        {props.showOtherLogos && (
          <>
            <img
              src="/images/logos/rg.jpeg"
              className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
            <img
              src="/images/logos/snooker-alley.jpeg"
              className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
          </>
        )}
      </div>
    </div>
  );
}
