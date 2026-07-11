interface TableNumberProps {
  venueNo: number | null;
  size: 'small' | 'large';
}

const SIZE_CLASSES = {
  small: {
    box: 'h-[min(5.2vh,5.2vw)] rounded-[min(0.8vh,0.8vw)]',
    text: 'text-[min(3.6vh,3.6vw)]',
    px: 'px-[min(1.3vh,1.3vw)]',
  },
  large: {
    box: 'h-[min(7.2vh,7.2vw)] rounded-[min(0.8vh,0.8vw)]',
    text: 'text-[min(6.4vh,6.4vw)]',
    px: 'px-[min(1.2vh,1.2vw)]',
  },
} as const;

export function TableNumber({ venueNo, size }: TableNumberProps) {
  const s = SIZE_CLASSES[size];
  return (
    <div className="flex justify-center items-center">
      <div
        className={`bg-white/5 ${s.box} shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center w-fit overflow-hidden shrink-0`}
      >
        <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
          <p className={`font-medium uppercase text-score-text text-box-trim text-center ${s.px} ${s.text}`}>t</p>
        </div>
        <div className={`bg-white flex justify-center items-center h-full ${s.px}`}>
          <p className={`font-medium leading-[130%] text-black text-box-trim py-[min(0.9vh,0.9vw)] ${s.text}`}>
            {venueNo || ''}
          </p>
        </div>
      </div>
    </div>
  );
}
