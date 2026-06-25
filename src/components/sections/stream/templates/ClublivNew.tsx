import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { generatePlayerName } from '@/utils/functions';

interface ClublivNewProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

export function ClublivNew(props: ClublivNewProps) {
  const isTeamReveresed =
    props.state && props.state.tournamentId && props.state.tournamentSubItem
      ? props.state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== props.state.tournamentTeamOneId
      : false;

  return (
    <div className="absolute bottom-2 left-2 right-2 mx-[min(1vh,1vw)] flex flex-col items-center">
      <div
        className="absolute -top-6 left-2 z-20"
        style={{ width: 'min(5.3rem, 8.5vw)', height: 'min(5.3rem, 8.5vw)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 64 64" fill="none">
          <defs>
            <clipPath id="logoClip">
              <path d="M48.6865 0.5H8C3.85786 0.5 0.5 3.85786 0.5 8V48.6865C0.500062 50.6754 1.29005 52.5828 2.69629 53.9893L10.0107 61.3037C11.4172 62.7099 13.3246 63.4999 15.3135 63.5H56C60.1421 63.5 63.5 60.1421 63.5 56V15.3135C63.4999 13.3246 62.7099 11.4172 61.3037 10.0107L53.9893 2.69629C52.5828 1.29005 50.6754 0.500061 48.6865 0.5Z" />
            </clipPath>
            <linearGradient id="paint0_linear_4239_3740" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <path
            d="M48.6865 0.5H8C3.85786 0.5 0.5 3.85786 0.5 8V48.6865C0.500062 50.6754 1.29005 52.5828 2.69629 53.9893L10.0107 61.3037C11.4172 62.7099 13.3246 63.4999 15.3135 63.5H56C60.1421 63.5 63.5 60.1421 63.5 56V15.3135C63.4999 13.3246 62.7099 11.4172 61.3037 10.0107L53.9893 2.69629C52.5828 1.29005 50.6754 0.500061 48.6865 0.5Z"
            fill="url(#paint0_linear_4239_3740)"
          />
          <image
            href={props.state!.teamOneLogo || '/images/user-dummy-pic.jpg'}
            x="8"
            y="8"
            width="48"
            height="48"
            clipPath="url(#logoClip)"
            preserveAspectRatio="xMidYMid meet"
          />
          <path
            d="M48.6865 0.5H8C3.85786 0.5 0.5 3.85786 0.5 8V48.6865C0.500062 50.6754 1.29005 52.5828 2.69629 53.9893L10.0107 61.3037C11.4172 62.7099 13.3246 63.4999 15.3135 63.5H56C60.1421 63.5 63.5 60.1421 63.5 56V15.3135C63.4999 13.3246 62.7099 11.4172 61.3037 10.0107L53.9893 2.69629C52.5828 1.29005 50.6754 0.500061 48.6865 0.5Z"
            stroke="#FFF2FD"
            fill="none"
          />
        </svg>
      </div>
      {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
        (props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id && (
          <div className="absolute left-24 -top-24 z-50">
            <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pl-[min(3vh,3vw)]">
              <h5 className="text-[min(2.8vh,2.8vw)] font-bold uppercase whitespace-nowrap bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
              </h5>
            </div>
          </div>
        ))}

      {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
        (props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id && (
          <div className="absolute left-24 -top-24 z-50">
            <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pl-[min(3vh,3vw)]">
              <h5 className="text-[min(2.8vh,2.8vw)] font-bold uppercase whitespace-nowrap bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
              </h5>
            </div>
          </div>
        ))}
      <div
        style={{
          clipPath: 'polygon(0% 2%, 0% 2%, 5% 88%, 95% 88%, 100% 2%, 100% 2%)',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, #E126CD 0%, #67005C 100%)',
        }}
        className="z-20 h-full transform scale-y-[1] origin-center absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-5"
      >
        <div
          className="col-span-1 text-[min(3vh,3vw)] w-20 flex justify-center items-center text-white border-r-[1px] border-transparent"
          style={{
            borderImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%) 1 100%',
            borderImageSlice: '1',
          }}
        >
          <span>{props.activeSet ? props.activeSet?.teamOneScore : 0}</span>
        </div>
        <div
          style={{
            background: 'linear-gradient(180deg, #272126 0%, #4D434B 100%)',
            borderImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%) 1 100%',
            borderImageSlice: '1',
          }}
          className="col-span-1 text-[min(3vh,3vw)] w-20 flex justify-center items-center text-white border-r-[1px] border-transparent"
        >
          <span>
            {' '}
            {isTeamReveresed
              ? props.state.tournamentSubItem?.tournamentItem.teamTwoScore
              : props.state.tournamentSubItem?.tournamentItem.teamOneScore}
          </span>
        </div>

        <div
          className="col-span-1 text-[min(3vh,3vw)] w-20 flex justify-center items-center text-white  border-r-[1px] border-transparent"
          style={{
            borderImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%) 1 100%',
            borderImageSlice: '1',
          }}
        >
          <span>{props.state.tournamentSubItem?.gameFormat.noOfSets}</span>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, #272126 0%, #4D434B 100%)',
            borderImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%) 1 100%',
            borderImageSlice: '1',
          }}
          className="col-span-1 text-[min(3vh,3vw)] w-20 flex justify-center items-center text-white  border-r-[1px] border-transparent"
        >
          <span>
            {' '}
            {isTeamReveresed
              ? props.state.tournamentSubItem?.tournamentItem.teamOneScore
              : props.state.tournamentSubItem?.tournamentItem.teamTwoScore}
          </span>
        </div>

        <div className="col-span-1 text-[min(3vh,3vw)] w-20 flex justify-center items-center text-white">
          <span>{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
        </div>
      </div>
      <div
        className="absolute -top-6 right-2 z-20"
        style={{ width: 'min(5.3rem, 8.5vw)', height: 'min(5.3rem, 8.5vw)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 64 64" fill="none">
          <defs>
            <clipPath id="logoClip2">
              <path d="M15.3135 0.5H56C60.1421 0.5 63.5 3.85786 63.5 8V48.6865C63.4999 50.6754 62.7099 52.5828 61.3037 53.9893L53.9893 61.3037C52.5828 62.7099 50.6754 63.4999 48.6865 63.5H8C3.85786 63.5 0.5 60.1421 0.5 56V15.3135C0.500062 13.3246 1.29005 11.4172 2.69629 10.0107L10.0107 2.69629C11.4172 1.29005 13.3246 0.500062 15.3135 0.5Z" />
            </clipPath>
            <linearGradient id="paint0_linear_4239_3742" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <path
            d="M15.3135 0.5H56C60.1421 0.5 63.5 3.85786 63.5 8V48.6865C63.4999 50.6754 62.7099 52.5828 61.3037 53.9893L53.9893 61.3037C52.5828 62.7099 50.6754 63.4999 48.6865 63.5H8C3.85786 63.5 0.5 60.1421 0.5 56V15.3135C0.500062 13.3246 1.29005 11.4172 2.69629 10.0107L10.0107 2.69629C11.4172 1.29005 13.3246 0.500062 15.3135 0.5Z"
            fill="url(#paint0_linear_4239_3742)"
          />
          <image
            href={props.state!.teamTwoLogo || '/images/user-dummy-pic.jpg'}
            x="8"
            y="8"
            width="48"
            height="48"
            clipPath="url(#logoClip2)"
            preserveAspectRatio="xMidYMid meet"
          />
          <path
            d="M15.3135 0.5H56C60.1421 0.5 63.5 3.85786 63.5 8V48.6865C63.4999 50.6754 62.7099 52.5828 61.3037 53.9893L53.9893 61.3037C52.5828 62.7099 50.6754 63.4999 48.6865 63.5H8C3.85786 63.5 0.5 60.1421 0.5 56V15.3135C0.500062 13.3246 1.29005 11.4172 2.69629 10.0107L10.0107 2.69629C11.4172 1.29005 13.3246 0.500062 15.3135 0.5Z"
            stroke="#FFF2FD"
            fill="none"
          />
        </svg>
      </div>
      <div
        className="w-full flex flex-col items-center rounded-t-lg rounded-md z-0 overflow-hidden"
        style={{ clipPath: 'polygon(0% 0%, 0% 60%, 3% 100%, 97% 100%, 100% 60%, 100% 0%)' }}
      >
        <div className="bg-[#140912] w-full px-2 pt-2 grid grid-cols-12 relative">
          <div className="col-span-4 flex items-center h-full">
            <h5 className=" pl-28 text-white flex flex-col  text-left h-full justify-center">
              <span className="text-[min(3vh,3vw)] leading-8 font-bold  uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
              </span>
              <span className="text-[min(2.2vh,2.2vw)] text-[#FFFBFE] opacity-60  uppercase whitespace-nowrap">
                {props.state.teamOneName}
              </span>
            </h5>
          </div>
          <div className="col-span-4 text-transparent">&nbsp;</div>
          <div className="col-span-4 flex items-center h-full justify-end">
            <h5 className=" pr-28 text-white flex flex-col text-right h-full justify-center">
              <span className="text-[min(3vh,3vw)] leading-8 font-bold uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
              </span>
              <span className="text-[min(2.2vh,2.2vw)] text-[#FFFBFE] opacity-60 uppercase whitespace-nowrap">
                {props.state.teamTwoName}
              </span>
            </h5>
          </div>
        </div>
        <div className="grid grid-cols-12 w-full">
          <div
            className="col-span-4 bg-[#1E1E1E] py-1 rounded-md overflow-hidden"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 93% 100%, 7% 100%)' }}
          >
            <h5 className="text-[min(2.2vh,2.2vw)] pl-12 text-[#FFF2FD] font-bold uppercase whitespace-nowrap flex gap-4 items-center">
              <span>{props.state?.tournamentSubItem?.tournamentItem.tournamentPhase.name}</span>
              <div
                style={{
                  borderRadius: '1px',
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 50%, rgba(255, 255, 255, 0.00) 100%)',
                }}
                className="w-0.5 h-7"
              ></div>
              <span>{props.state?.format}</span>
            </h5>
          </div>
          <div className="col-span-4">
            <p className="text-transparent">&nbps;</p>
          </div>
          <div
            className="col-span-4 bg-[#1E1E1E] text-right rounded-md py-1 overflow-hidden"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 93% 100%, 7% 100%)' }}
          >
            {' '}
            <h5 className="text-[min(2.2vh,2.2vw)] pr-12 text-[#FFF2FD] text-right justify-end font-bold uppercase whitespace-nowrap flex gap-4 items-center">
              <span>{props.state?.tournamentName}</span>
            </h5>
          </div>
        </div>

        {/* <div className="w-full h-auto flex items-center bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] rounded-lg">
        <div className="h-full flex items-center">
          <div className="h-full w-[min(13vh,13vw)] rounded-lg overflow-hidden">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.jpg"
              className="w-full h-full object-cover"
              src={props.state!.teamOneLogo ? props.state!.teamOneLogo : '/images/user-dummy-pic.jpg'}
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 flex justify-between items-center bg-[#D5D5D5]">
            <div className="w-auto flex min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id ? (
                <div className="inline-block relative">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pl-[min(3vh,3vw)]">
                    <h5 className="text-[min(2.8vh,2.8vw)] font-bold uppercase whitespace-nowrap bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                      <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
                    </h5>
                  </div>
                </div>
              ) : (
                <div className="w-[min(20vh,20vw)] bg-[#D5D5D5]" />
              )}
            </div>
            <div className="flex-1 bg-[#D5D5D5] h-[min(5vh,5vw)] flex items-center justify-center">
              <h5 className="text-[min(2.4vh,2.4vw)] text-primary font-bold uppercase whitespace-nowrap text-center w-full">
                {props.state?.tournamentName || 'Tournament'} <span className="mx-1 text-primary">|</span>{' '}
                {props.state?.format}
              </h5>
            </div>
            <div className="w-auto flex justify-end min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id ? (
                <div className="inline-block relative">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pr-[min(3vh,3vw)]">
                    <h5 className="text-[min(2.8vh,2.8vw)] font-bold uppercase whitespace-nowrap bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                      <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
                    </h5>
                  </div>
                </div>
              ) : (
                <div className="w-[min(20vh,20vw)]" />
              )}
            </div>
          </div>
          <div className="w-full h-1/3 bg-black grid grid-cols-3 items-center px-[min(2vh,2vw)]">
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-left uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
                {props.state?.teamOneHandicap !== undefined && (
                  <span className="ml-2 text-yellow-400">
                    {props.state.teamOneHandicap && props.state.teamOneHandicap > 0 ? '+' : ''}
                    {props.state.teamOneHandicap}
                  </span>
                )}
              </h5>
            </div>
            <div className="col-span-1 flex justify-center">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold uppercase whitespace-nowrap flex items-center">
                <div className="bg-primary px-[min(4vh,4vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamOneScore : 0}
                </div>
                <div className="bg-[#424242] px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">{props.state.teamOneScore}</div>
                <div className="bg-primary px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">
                  {props.state.tournamentSubItem?.gameFormat.noOfSets}
                </div>
                <div className="bg-[#424242] px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">{props.state.teamTwoScore}</div>
                <div className="bg-primary px-[min(4vh,4vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamTwoScore : 0}
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-right uppercase whitespace-nowrap">
                {props.state?.teamTwoHandicap !== undefined && (
                  <span className="mr-2 text-yellow-400">
                    {props.state.teamTwoHandicap && props.state.teamTwoHandicap > 0 ? '+' : ''}
                    {props.state.teamTwoHandicap}
                  </span>
                )}
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 flex items-center justify-between bg-[#212121]">
            <div className="min-w-[45%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-yellow-400 font-bold text-left uppercase whitespace-nowrap">
                {props.state?.teamOneName}{' '}
                <span className="bg-primary text-white px-[min(1vh,1vw)] ml-2">
                  {isTeamReveresed
                    ? props.state.tournamentSubItem?.tournamentItem.teamTwoScore
                    : props.state.tournamentSubItem?.tournamentItem.teamOneScore}
                </span>
              </h5>
            </div>
            <div className="min-w-[10%] flex justify-center">
              <div className="px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">
                <h5 className="text-[min(2.2vh,2.2vw)] text-white font-bold uppercase whitespace-nowrap">
                  {props.state?.tournamentSubItem?.tournamentItem.tournamentPhase.name}
                </h5>
              </div>
            </div>
            <div className="min-w-[45%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-yellow-400 font-bold text-right uppercase whitespace-nowrap">
                <span className="bg-primary text-white px-[min(1vh,1vw)] mr-2">
                  {isTeamReveresed
                    ? props.state.tournamentSubItem?.tournamentItem.teamOneScore
                    : props.state.tournamentSubItem?.tournamentItem.teamTwoScore}
                </span>{' '}
                {props.state?.teamTwoName}
              </h5>
            </div>
          </div>
        </div>
        <div className="h-full flex items-center">
          <div className="h-full w-[min(13vh,13vw)] rounded-lg overflow-hidden">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.jpg"
              className="w-full h-full object-cover"
              src={props.state!.teamTwoLogo ? props.state!.teamTwoLogo : '/images/user-dummy-pic.jpg'}
            />
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
}
