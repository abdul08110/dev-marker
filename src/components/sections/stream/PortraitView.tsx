import { useState } from 'react';
import { StreamingState } from '@/hooks/useStreaming';
import { calculateStatsForTeam, getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { generatePlayerName } from '@/utils/functions';
import { ProfileCard } from '@/components/ProfileCard';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import { cn } from '@/lib/utils';

interface PortraitStreamDataProps {
  state: StreamingState | null;
  timeLeft: number;
}

export function PortraitView(props: PortraitStreamDataProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = props.state ? props.state.sideOnePlayerOne.id === props.state.activePlayerId : false;
  const isTeamTwoActive = props.state ? props.state.sideTwoPlayerOne.id === props.state.activePlayerId : false;

  const teamOneStats = calculateStatsForTeam(
    [props.state?.sideOnePlayerOne.id || '', props.state?.sideOnePlayerTwo?.id || ''],
    props.state?.sets || [],
  );
  const teamTwoStats = calculateStatsForTeam(
    [props.state?.sideTwoPlayerOne.id || '', props.state?.sideTwoPlayerTwo?.id || ''],
    props.state?.sets || [],
  );

  const [showPreviousFrames, setShowPreviousFrames] = useState(false);
  const completedSets = (props.state?.sets ?? []).filter((s) => s.status === 'COMPLETED');

  if (!props.state) {
    return <></>;
  }

  return (
    <div className="flex-grow min-h-0 overflow-y-scroll flex flex-col px-2 gap-2 mt-2 mb-2">
      <div className="bg-[#1C1C1C] rounded-md min-h-full">
        {/* Tournament banner */}
        {props.state.tournamentName && (
          <div className="relative">
            <img src="/images/bg-pattern.jpg" width={'100%'} height={64} className="h-16 object-cover" />
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="font-medium text-xl leading-[130%] uppercase text-white">{props.state.tournamentName}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 divide-x divide-white/[.12] border-b border-white/[.12]">
          <div className={clsx({ 'bg-[#9B36BA]': isTeamOneActive, 'bg-[#1F1F1F]': !isTeamOneActive })}>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative" style={{ flexShrink: 0 }}>
                  <ProfileCard
                    isBorder={true}
                    color="#202020"
                    imageUrl={
                      props.state.teamOneLogo
                        ? props.state.teamOneLogo
                        : props.state.sideOnePlayerOne.profilePhoto
                          ? props.state.sideOnePlayerOne.profilePhoto
                          : '/images/user-dummy-pic.jpg'
                    }
                    size={60}
                    handicap={
                      props.state.teamOneHandicap
                        ? `H${props.state.teamOneHandicap > 0 ? '+' : ''}${props.state.teamOneHandicap}`
                        : ''
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-medium text-[28px] leading-[130%] text-white drop-shadow-[0px_2px_4px_0px_#000000FA]">
                    {activeSet && activeSet?.teamOneScore}
                  </p>
                  <span className={cn('text-white/70 text-xs font-bold', isTeamOneActive ? '' : 'invisible')}>
                    BREAK {activeTurn && activeTurn?.score}
                  </span>
                </div>
              </div>
              <p className="font-medium text-[17px] leading-[130%] uppercase text-white line-clamp-1">
                {generatePlayerName(
                  props.state.sideOnePlayerOne.name,
                  props.state.sideOnePlayerTwo ? props.state.sideOnePlayerTwo.name : undefined,
                )}
              </p>
            </div>
            {props.state.tournamentId && (
              <div className="px-4 py-3 flex gap-3 items-center">
                <ImageWithFallback
                  className="aspect-square overflow-hidden border-white size-8 object-cover shrink-0 rounded-full"
                  fallback="/images/user-dummy-pic.jpg"
                  src={
                    props.state.teamOneLogo
                      ? props.state.teamOneLogo
                      : props.state.sideOnePlayerOne.profilePhoto
                        ? props.state.sideOnePlayerOne.profilePhoto
                        : '/images/user-dummy-pic.jpg'
                  }
                />
                <p className="uppercase text-sm leading-[130%] text-white text-nowrap truncate">
                  {props.state.teamOneName ||
                    generatePlayerName(
                      props.state.sideOnePlayerOne.name,
                      props.state.sideOnePlayerTwo ? props.state.sideOnePlayerTwo.name : undefined,
                    )}
                </p>
              </div>
            )}
          </div>
          <div className={clsx({ 'bg-[#9B36BA]': isTeamTwoActive, 'bg-[#1F1F1F]': !isTeamTwoActive })}>
            <div className="p-4 space-y-4">
              <div className="flex flex-row-reverse justify-between items-center gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-[28px] leading-[130%] text-white drop-shadow-[0px_2px_4px_0px_#000000FA]">
                    {activeSet && activeSet?.teamTwoScore}
                  </p>

                  <span className={cn('text-white/70 text-xs font-bold', isTeamTwoActive ? '' : 'invisible')}>
                    BREAK {activeTurn && activeTurn?.score}
                  </span>
                </div>

                <div className="relative" style={{ flexShrink: 0 }}>
                  <ProfileCard
                    isBorder
                    color="#202020"
                    imageUrl={
                      props.state.teamTwoLogo
                        ? props.state.teamTwoLogo
                        : props.state.sideTwoPlayerOne.profilePhoto
                          ? props.state.sideTwoPlayerOne.profilePhoto
                          : '/images/user-dummy-pic.jpg'
                    }
                    size={60}
                    handicap={
                      props.state.teamTwoHandicap
                        ? `H${props.state.teamTwoHandicap > 0 ? '+' : ''}${props.state.teamTwoHandicap}`
                        : ''
                    }
                  />
                </div>
              </div>
              <p className="font-medium text-[17px] leading-[130%] uppercase text-white line-clamp-1 text-left">
                {generatePlayerName(
                  props.state.sideTwoPlayerOne.name,
                  props.state.sideTwoPlayerTwo ? props.state.sideTwoPlayerTwo.name : undefined,
                )}
              </p>
            </div>
            {props.state.tournamentId && (
              <div className="px-4 py-3 flex justify-end gap-3 items-center">
                <p className="uppercase text-sm leading-[130%] text-white text-nowrap truncate">
                  {props.state.teamTwoName ||
                    generatePlayerName(
                      props.state.sideTwoPlayerOne.name,
                      props.state.sideTwoPlayerTwo ? props.state.sideTwoPlayerTwo.name : undefined,
                    )}
                </p>
                <ImageWithFallback
                  className="aspect-square overflow-hidden border-white size-8 object-cover shrink-0 rounded-full"
                  fallback="/images/user-dummy-pic.jpg"
                  src={
                    props.state.teamTwoLogo
                      ? props.state.teamTwoLogo
                      : props.state.sideTwoPlayerOne.profilePhoto
                        ? props.state.sideTwoPlayerOne.profilePhoto
                        : '/images/user-dummy-pic.jpg'
                  }
                />
              </div>
            )}
          </div>
        </div>
        {props.state.sport === 'SNOOKER' && (
          <div className="grid grid-cols-2 w-full gap-2 py-4 pb-0">
            <SnookerPointTypeDisplay
              class={'gap-[0.3rem]'}
              className={'text-[0.8rem] font-mono h-5 w-5 flex justify-center'}
              placeholderCount={6}
              activeTurnPointTypes={getSnookerPointTypesByTurns(
                activeSet?.turns?.filter((value) =>
                  [props.state!.sideOnePlayerOne, props.state!.sideOnePlayerTwo].some(
                    (player) => player && value.turnPlayerId === player.id,
                  ),
                ) || [],
              )}
            />

            <div>
              <SnookerPointTypeDisplay
                class={'gap-[0.3rem]'}
                className={'text-[0.8rem] font-mono h-5 w-5 flex justify-center'}
                placeholderCount={6}
                activeTurnPointTypes={getSnookerPointTypesByTurns(
                  activeSet?.turns?.filter((value) =>
                    [props.state!.sideTwoPlayerOne, props.state!.sideTwoPlayerTwo].some(
                      (player) => player && value.turnPlayerId === player.id,
                    ),
                  ) || [],
                )}
              />
            </div>
          </div>
        )}
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-4 select-none">
            <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{props.state.teamOneScore}</p>
            <div className="bg-white/[.12] h-px w-full" />
            <p className="uppercase text-xs leading-[130%] text-[#FFFBFE]/60 shrink-0">Frames Won</p>
            <div className="bg-white/[.12] h-px w-full" />
            <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{props.state.teamTwoScore}</p>
          </div>

          <div className="flex items-center gap-4 select-none">
            <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{teamOneStats.highestBreak}</p>
            <div className="bg-white/[.12] h-px w-full" />
            <p className="uppercase text-xs leading-[130%] text-[#FFFBFE]/60 shrink-0">Highest Break</p>
            <div className="bg-white/[.12] h-px w-full" />
            <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{teamTwoStats.highestBreak}</p>
          </div>
          {completedSets.length > 0 ? (
            <div>
              <div
                onClick={() => setShowPreviousFrames((v) => !v)}
                className="w-full border border-white/[.12] px-3 py-4 rounded bg-[#202020] "
              >
                <div className="flex justify-between items-center">
                  <p className="uppercase text-xs leading-[130%] text-[#FFFBFE]/60 shrink-0 select-none">
                    Previous Frame Scores
                  </p>
                  {showPreviousFrames ? (
                    <ChevronUp size={16} className="text-white" />
                  ) : (
                    <ChevronDown size={16} className="text-white" />
                  )}
                </div>
                {showPreviousFrames && completedSets.length > 0 && (
                  <div className="mt-4 space-y-4 select-none">
                    {completedSets.map((set, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{set.teamOneScore}</p>
                        <div className="bg-white/[.12] h-px w-full" />
                        <p className="uppercase text-xs leading-[130%] text-[#FFFBFE]/60 shrink-0">Frame {i + 1}</p>
                        <div className="bg-white/[.12] h-px w-full" />
                        <p className="text-[#FFF2FD] text-[17px] shrink-0 font-medium">{set.teamTwoScore}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
