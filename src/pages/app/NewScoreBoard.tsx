import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ScoreBoardState } from '@/hooks/useScoreboard';
import TimerDial from './TimerDial';

interface LegacyScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

const NewScoreBoard = ({ state, timeLeft }: LegacyScoreBoardProps) => {
  console.log(state);
  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center min-h-screen px-10 py-7 bg-no-repeat flex flex-col justify-between gap-[70px]">
      <div className="grid grid-cols-3 items-center border-b-2 py-5 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-7 py-3 w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-16"
            fallback="/images/user-dummy-pic.png"
            src={state.clubLogo ?? ''}
          />
          <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
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
          match time 00:24:18
        </p>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-12 place-items-center">
        {/* Card 1 */}

        <div className="w-full border rounded-[60px] items-stretch overflow-hidden p-2">
          <div className="border-[6px] rounded-[60px] shadow-[0px_3px_21px_0px_#DCF756] backdrop-blur-sm">
            <div className="">
              <div className="">
                <div className="border-b p-8 border-white/10 flex gap-4">
                  <div
                    className="bg-[#FFD400] p-[2px] size-[120px] relative rounded-xl overflow-hidden"
                    style={{
                      clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)',
                      flexShrink: 0,
                    }}
                  >
                    <ImageWithFallback
                      style={{
                        clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)',
                      }}
                      className="object-cover rounded-xl w-full h-full"
                      fallback="/images/user-dummy-pic.png"
                      src={
                        state.teamOneLogo
                          ? state.teamOneLogo
                          : state.sideOnePlayerOne.profilePhoto
                            ? state.sideOnePlayerOne.profilePhoto
                            : '/images/user-dummy-pic.png'
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <p className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim">
                        naresh chowhan
                      </p>

                      <div className="bg-white/5 rounded-full shadow-[0px_2px_4px_0px_#FFFFFF40_inset] flex items-center h-[50px] w-fit overflow-hidden shrink-0">
                        <div className="bg-sandy-yellow flex justify-center items-center px-4 h-full">
                          <p className="font-medium text-[40px] leading-[130%] uppercase text-black text-box-trim py-2.5">
                            +12
                          </p>
                        </div>
                        <span className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-2.5">
                          h
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-[linear-gradient(90deg,rgba(223,227,115,0)_5%,rgba(223,227,115,0.7)_45%,rgba(223,227,115,0.7)_60%,rgba(223,227,115,0)_82.24%)]" />
                    <div className="flex items-center justify-between gap-4 w-full">
                      <p className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim">
                        naresh chowhan
                      </p>

                      <div className="bg-white/5 rounded-full shadow-[0px_2px_4px_0px_#FFFFFF40_inset] flex items-center h-[50px] w-fit overflow-hidden shrink-0">
                        <div className="bg-sandy-yellow flex justify-center items-center px-4 h-full">
                          <p className="font-medium text-[40px] leading-[130%] uppercase text-black text-box-trim py-2.5">
                            +12
                          </p>
                        </div>
                        <span className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-2.5">
                          h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 relative flex justify-center items-center">
                <p className="font-semibold leading-[130%] uppercase text-score-text text-[12.5rem]">41</p>
                <div className="absolute right-0 text-white top-1/2 -translate-y-1/2">
                  <p className="font-semibold text-[26px] leading-[130%] uppercase text-sandy-yellow px-4 text-right">
                    Break
                  </p>
                  <div className="rounded-tl-full rounded-bl-full px-5 bg-[linear-gradient(69.46deg,rgba(172,236,84,0.078)_12.28%,rgba(111,255,0,0.6)_179.54%)] shadow-[0px_2px_4px_0px_#FFFFFF40_inset] break-card ">
                    <p className="font-semibold text-[90px] leading-[130%] uppercase text-sandy-yellow px-4">34</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Balls */}

            <div className=" border-t px-8 py-5 gap-4 [border-image-source:linear-gradient(90deg,rgba(223,227,115,0)_5%,rgba(223,227,115,0.7)_45%,rgba(223,227,115,0.7)_60%,rgba(223,227,115,0)_82.24%)] [border-image-slice:1] flex flex-col justify-center items-center">
              <div className="flex gap-1">
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />

                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/yellow-ball.svg"
                  src={'/images/balls/yellow-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/black-ball.svg"
                  src={'/images/balls/black-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/placeholder-ball.svg"
                  src="/images/balls/placeholder-ball.svg"
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/placeholder-ball.svg"
                  src="/images/balls/placeholder-ball.svg"
                />
              </div>
              <div className="flex gap-1">
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />

                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/yellow-ball.svg"
                  src={'/images/balls/yellow-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/black-ball.svg"
                  src={'/images/balls/black-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/red-ball.svg"
                  src={'/images/balls/red-ball.svg'}
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/placeholder-ball.svg"
                  src="/images/balls/placeholder-ball.svg"
                />
                <ImageWithFallback
                  className="object-cover size-8"
                  fallback="/images/balls/placeholder-ball.svg"
                  src="/images/balls/placeholder-ball.svg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time Dial */}
        <div
          className="rounded-[60px] p-[5px]"
          style={{
            background: `
            linear-gradient(233.61deg,#FFECFF -11.62%,rgba(255,255,255,0) 50.44%),
            linear-gradient(172.2deg,rgba(191,178,247,0) 71.46%,#E8B2F7 107.96%),
            linear-gradient(347.86deg,rgba(210,154,245,0) 13.85%,#F4D3F2 105.37%)
    `,
            boxShadow: `
            0px 0px 16px 0px #FFEDFF,
            10px 10px 28px 0px #0F0B23CC,
            -11px 0px 24px 0px #0E0B24CC
    `,
          }}
        >
          <div className="rounded-[55px] py-11 bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)]">
            {/* Team score */}
            <div className="space-y-6">
              <p className="text-text-light font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                Team Score
              </p>

              <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-20 flex justify-center items-center">
                  162
                </p>

                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-20 [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                  (1/7)
                </p>
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-20 flex justify-center items-center">
                  162
                </p>
              </div>
            </div>
            {/* Timer */}
            <TimerDial />
            {/* Game Score */}
            <div className="space-y-6">
              <p className="text-text-light font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                game score
              </p>

              <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-20 flex justify-center items-center">
                  0
                </p>

                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-20 [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                  (3)
                </p>
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-20 flex justify-center items-center">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}

        <div className="bg-blue-50 w-full rounded-[60px]">Card 2</div>
      </div>
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[18px]">
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-2.5">
          15 red singles
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat relative h-16 w-[289px]">
          <div className=" px-4 absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
              table 4
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
          Snooker
        </p>
      </div>
    </main>
  );
};

export default NewScoreBoard;
