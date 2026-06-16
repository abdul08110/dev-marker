import ImageWithFallback from '@/components/ui/image-with-fallback';

const QRCode = () => {
  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center min-h-screen px-10 py-7 bg-no-repeat flex flex-col justify-between gap-[70px]">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-5 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-7 py-3 w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-16"
            fallback="/images/user-dummy-pic.png"
            //   src={state?.clubLogo ?? ''}
            src={''}
          />
          <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {/* {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName} */}
            cosmopolitan club
          </p>
        </div>

        <ImageWithFallback
          className="object-cover justify-self-center"
          width={400}
          height={115}
          fallback="/images/clubliv-final-logo.png"
          src={'/images/logos/clubliv-logo.svg'}
        />

        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          {/* match time {formatTime(timeLeft)} */}
          match time 00:24:18
        </p>
      </div>

      {/* Singles */}
      <div className=" grid grid-cols-3 gap-x-20 items-center hidden">
        <div className="border-2 p-6 flex gap-3 items-center max-h-[150px]">
          <div className="size-[100px] bg-red-50"></div>
          <p className="font-medium text-3xl leading-[130%] uppercase">Player 1</p>
        </div>
        <div className="h-[400px] w-full bg-red-50"></div>
        <div className="border-2 p-6 flex gap-3 items-center max-h-[150px]">
          <div className="size-[100px] bg-red-50"></div>
          <p className="font-medium text-3xl leading-[130%] uppercase">----------------</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-20 items-center">
        <div className="flex flex-col justify-between items-center">
          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text text-center">Team a</p>
          <div className="h-[400px] w-full bg-red-50"></div>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="border-2 p-6 flex gap-3 items-center max-h-[100px] text-score-text">
              <div className="size-16 bg-red-50"></div>
              <p className="font-medium text-3xl leading-[130%] uppercase">Player 1</p>
            </div>
            <div className="border-2 p-6 flex gap-3 items-center max-h-[100px] text-score-text">
              <div className="size-16 bg-red-50"></div>
              <p className="font-medium text-3xl leading-[130%] uppercase">Player 1</p>
            </div>
          </div>
          <hr className="border border-white" />
          <div className="space-y-3">
            <div className="border-2 p-6 flex gap-3 items-center max-h-[100px] text-score-text">
              <div className="size-16 bg-red-50"></div>
              <p className="font-medium text-3xl leading-[130%] uppercase">Player 1</p>
            </div>
            <div className="border-2 p-6 flex gap-3 items-center max-h-[100px] text-score-text">
              <div className="size-16 bg-red-50"></div>
              <p className="font-medium text-3xl leading-[130%] uppercase">Player 1</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center">
          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text text-center">Team b</p>
          <div className="h-[400px] w-full bg-red-50"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[18px]">
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-2.5">
          {/* {footerLabel} */}
          15 Red Ball
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat relative h-16 w-[289px]">
          <div className="px-4 absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
              {/* table {state.venueNo} */}
              table 4
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
          {/* {state.sport} */}
          Snooker
        </p>
      </div>
    </main>
  );
};

export default QRCode;
