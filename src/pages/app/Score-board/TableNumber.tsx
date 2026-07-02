interface TableNumberProps {
  venueNo: number | null;
  isTournament: boolean;
}

export function TableNumber({ venueNo, isTournament }: TableNumberProps) {
  if (isTournament) {
    return (
      <div className="pt[min(2vh,2vw)]">
        {/* <div
          className="border-y-2 [border-image-slice:1] py-[min(2vh,2vw)] flex flex-col items-center gap-[min(0.7vh,0.7vw)]"
          style={{
            borderImageSource:
              'linear-gradient(90deg, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0.6) 51.16%, rgba(255, 255, 255, 0) 95%)',
          }}
        >
          <div className="flex justify-center items-center pt[min(6vh,6vw)]">
            <div className="bg-white/5 rounded-[10px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(8vh,8vw)] w-fit overflow-hidden shrink-0">
              <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
                <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)]  text-center text-[min(7.6vh,7.6vw)]">
                  t
                </p>
              </div>
              <div className=" bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
                <p className="font-medium leading-[130%] text-[min(7.6vh,7.6vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
                  {venueNo || ''}
                </p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex justify-center items-center pt[min(6vh,6vw)]">
          <div className="bg-white/5 rounded-[10px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(8vh,8vw)] w-fit overflow-hidden shrink-0">
            <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
              <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)]  text-center text-[min(4.6vh,4.6vw)]">
                t
              </p>
            </div>
            <div className=" bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
              <p className="font-medium leading-[130%] text-[min(4.6vh,4.6vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
                {venueNo || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center pt-[min(5.5vh,5.5vw)]">
      <div className="bg-white/5 rounded-[10px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(8vh,8vw)] w-fit overflow-hidden shrink-0">
        <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
          <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)]  text-center text-[min(7.6vh,7.6vw)]">
            t
          </p>
        </div>
        <div className=" bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
          <p className="font-medium leading-[130%] text-[min(7.6vh,7.6vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
            {venueNo || ''}
          </p>
        </div>
      </div>
    </div>
  );
}
