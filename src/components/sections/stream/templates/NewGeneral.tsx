import React from 'react';

import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { convertHandicapToString, generatePlayerName } from '@/utils/functions';

interface GeneralTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

const NewGeneral = (props: GeneralTemplateProps) => {
  return (
    <div className="absolute bottom-[min(1.5vh,1.5vw)] mx-[min(1.5vh,1.5vw)] flex flex-col items-center border border-white w-[calc(100%-min(3vh,3vw))] bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center rounded-[32px] bg-black">
      <div className="w-full h-auto flex justify-between items-center px-4 py-3 gap-4">
        <div
          className="relative px-6 py-4 rounded-[20px] shadow-[0px_3px_20.8px_0px_#DCF756] shrink-0 backdrop-blur-[24px]"
          style={{
            background:
              'linear-gradient(#111, #111) padding-box, linear-gradient(144.83deg, rgba(213, 255, 154, 0.02) -0.26%, #C1F052 34.38%, #AAEA4B 58.47%, #B7F47B 92.16%) border-box',
            border: '1px solid transparent',
          }}
        >
          <div className="flex items-center gap-6">
            <div className="overflow-hidden size-[min(10vh,10vw)] rounded-full">
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
                className="size-full object-cover"
                src={
                  props.state!.sideOnePlayerOne.profilePhoto
                    ? props.state!.sideOnePlayerOne.profilePhoto
                    : '/images/user-dummy-pic.png'
                }
              />
            </div>
            <div className="flex flex-col gap-y-2.5">
              {/* Player */}
              <div className="flex justify-between items-center gap-36">
                {/* Plyer name */}
                <p className="uppercase font-bold text-32 text-score-text">Swaminathan ps </p>

                {/* Player Handicap */}
                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)]">
                  <span className="font-medium text-2xl leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-1.5">
                    h
                  </span>
                  <div className="bg-sandy-yellow px-4 py-1.5 shadow-[inset_0px_0px_3.07px_0px_#929504]">
                    <span className="font-medium text-2xl leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="border-2
              [border-image-source:linear-gradient(90deg,rgba(251,255,127,0)_5%,rgba(251,255,127,0.6)_51.16%,rgba(225,229,116,0)95%)] [border-image-slice:1]
              "
              />

              {/* Team */}
              <div className="flex justify-between items-center gap-36">
                {/* Team Name */}
                <p className="uppercase font-medium text-2xl text-score-text">bull’s eye </p>
                {/* Team Handicap */}

                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)]">
                  <span className="font-medium text-2xl leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-1.5">
                    h
                  </span>
                  <div className="bg-sandy-yellow px-4 py-1.5 shadow-[inset_0px_0px_3.07px_0px_#929504]">
                    <span className="font-medium text-2xl leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-red-50 w-full">ff</div>

        <div
          className="relative px-6 py-4 rounded-[20px] shadow-[0px_3px_10.8px_0px_#E38BF9] shrink-0 backdrop-blur-[24px]"
          style={{
            background:
              'linear-gradient(#111, #111) padding-box, linear-gradient(144.83deg, rgba(210, 154, 245, 0.02) -0.26%, #B079E3 34.38%, #E38BF9 58.47%, #E38BF9 92.16%) border-box',
            border: '1px solid transparent',
          }}
        >
          <div className="flex flex-row-reverse items-center gap-6">
            <div className="overflow-hidden size-[min(10vh,10vw)] rounded-full">
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
                className="size-full object-cover"
                src={
                  props.state!.sideTwoPlayerOne?.profilePhoto
                    ? props.state!.sideTwoPlayerOne?.profilePhoto
                    : '/images/user-dummy-pic.png'
                }
              />
            </div>
            <div className="flex flex-col gap-y-2.5">
              {/* Player */}
              <div className="flex flex-row-reverse justify-between items-center gap-36">
                {/* Plyer name */}
                <p className="uppercase font-bold text-32 text-score-text">Swaminathan ps </p>

                {/* Player Handicap */}
                <div
                  className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)]
                "
                >
                  <span className="font-medium text-2xl leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-1.5">
                    h
                  </span>
                  <div className="bg-violet px-4 py-1.5 shadow-[inset_0px_0px_3.03px_0px_#C600F7]">
                    <span className="font-medium text-2xl leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="border-2
              [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_5%,rgba(227,139,249,0.6)_51.16%,rgba(227,139,249,0)_95%)] [border-image-slice:1]
              "
              />

              {/* Team */}
              <div className="flex flex-row-reverse justify-between items-center gap-36">
                {/* Team Name */}
                <p className="uppercase font-medium text-2xl text-score-text">bull’s eye </p>
                {/* Team Handicap */}

                <div
                  className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)]
                "
                >
                  <span className="font-medium text-2xl leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-1.5">
                    h
                  </span>
                  <div className=" bg-violet px-4 py-1.5 shadow-[inset_0px_0px_3.03px_0px_#C600F7]">
                    <span className="font-medium text-2xl leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGeneral;
