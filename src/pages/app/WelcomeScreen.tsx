import ImageWithFallback from '@/components/ui/image-with-fallback';

type PropsType = {
  venue: number | null | undefined;
  clubLogo: string;
  clubName: string;
};

const WelcomeScreen = ({ venue, clubLogo, clubName }: PropsType) => {
  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] bg-no-repeat flex flex-col overflow-hidden">
      <div className=" border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <ImageWithFallback
          className="justify-self-center w-[min(37vh,37vw)] h-auto"
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />
      </div>

      <div className="flex flex-col justify-center items-center h-full">
        <div className="space-y-[min(5vh,5vw)]">
          <div className="flex flex-col gap-[min(2.8vh,2.8vw)]">
            <ImageWithFallback
              className="justify-self-center w-[min(28vh,28vw)] h-auto rounded-full overflow-hidden"
              fallback="/images/clubliv-final-logo.png"
              src={clubLogo}
            />
            <p className="font-semibold leading-[130%] text-score-text text-[min(5vh,5vw)] text-center"> {clubName} </p>
          </div>
          <div className="flex justify-center items-center">
            <div className="bg-white/5 rounded-[10px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(11vh,11vw)] w-fit overflow-hidden shrink-0">
              <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
                <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)]  text-center text-[min(12.5vh,12.5vw)]">
                  t
                </p>
              </div>
              <div className=" bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
                <p className="font-medium leading-[130%] text-[min(12.5vh,12.5vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
                  {venue}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="font-semibold leading-[130%] text-score-text text-[min(2.1vh,2.1vw)] pt-[min(2.7vh,2.7vw)]">
          waiting for match to start
        </p>
      </div>
    </main>
  );
};

export default WelcomeScreen;
