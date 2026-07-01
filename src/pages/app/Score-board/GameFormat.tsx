interface GameFormatProps {
  sport: string;
  format: string | null;
  isTournament: boolean;
}

export function GameFormat({ sport, format, isTournament }: GameFormatProps) {
  const icon = (
    <div className="flex flex-col justify-center items-center pt-[min(3vh,3vw)] pb-[min(3vh,3vw)] gap-1">
      {sport === 'SNOOKER' ? (
        <>
          <img src="/images/snooker.svg" alt="" className="size-[min(7vh,7vw)]" />
          <p className="text-score-text leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
            Snooker
          </p>
        </>
      ) : (
        <>
          <img src="/images/billiards.svg" alt="" className="size-[min(7vh,7vw)]" />
          <p className="text-score-text leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40] pb-3">
            Billiards
          </p>
        </>
      )}
    </div>
  );

  if (!isTournament) {
    return icon;
  }

  return (
    <div className="">
      {icon}
      <div className="text-center">
        <p className="text-score-text text-wrap whitespace-pre-line leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
          {format}
          {/* {format?.split(' ').map((word, index) => {
            return (
              <span key={index}>
                {word}
                {index === 1 ? <br /> : ' '}
              </span>
            );
          })} */}
        </p>
      </div>
    </div>
  );
}
