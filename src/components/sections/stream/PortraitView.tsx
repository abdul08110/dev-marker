import { useState } from 'react';
import { StreamingState } from '@/hooks/useStreaming';
import { calculateStatsForTeam, getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { ProfileCard } from '@/components/ProfileCard';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { SnookerPointTypeDisplay, hasVisibleSnookerPoints } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import { cn, getRandomPlaceholderProfileImage } from '@/lib/utils';
import ChevronIcon from '@/icons/chevron-icon';
import { getPlayerDisplayName } from '@/utils/functions';

interface PortraitStreamDataProps {
  state: StreamingState | null;
  timeLeft: number;
}

export function PortraitView(props: PortraitStreamDataProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = props.state
    ? props.state.sideOnePlayerOne.id === props.state.activePlayerId ||
      props.state.sideOnePlayerTwo?.id === props.state.activePlayerId
    : false;
  const isTeamTwoActive = props.state
    ? props.state.sideTwoPlayerOne.id === props.state.activePlayerId ||
      props.state.sideTwoPlayerTwo?.id === props.state.activePlayerId
    : false;

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
  const isTeamOneDouble = !!props.state?.sideOnePlayerTwo;
  const isTeamTwoDouble = !!props.state?.sideTwoPlayerTwo;

  // Stable per-slot fallback avatars — one each for sideOnePlayerOne/Two, sideTwoPlayerOne/Two
  const [defaultImages] = useState(() => Array.from({ length: 4 }, () => getRandomPlaceholderProfileImage()));

  if (!props.state) {
    return <></>;
  }

  return (
    <div className="flex-grow min-h-0 overflow-y-scroll flex flex-col px-2 gap-2 mt-2 mb-2">
      <div className="bg-[#141414] rounded-md min-h-full">
        {/* Tournament banner */}
        {props.state.tournamentName && (
          <div className="relative rounded-t-[8px] overflow-hidden">
            <img src="/images/bg-pattern.jpg" width={'100%'} height={64} className="h-16 object-cover" />
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="font-medium text-xl leading-[130%] uppercase text-white">{props.state.tournamentName}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 divide-x divide-white/[.12] border-b border-white/[.12]">
          <div>
            <div className="p-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative space-y-2" style={{ flexShrink: 0 }}>
                  <div
                    className="relative"
                    style={isTeamOneDouble ? { width: 90, height: 90 } : { width: 70, height: 70 }}
                  >
                    {isTeamOneDouble ? (
                      <>
                        <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                          <ProfileCard
                            imageUrl={props.state.sideOnePlayerOne.profilePhoto || defaultImages[0]}
                            size={60}
                            isActive={isTeamOneActive}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
                          <ProfileCard
                            imageUrl={props.state.sideOnePlayerTwo?.profilePhoto || defaultImages[1]}
                            size={60}
                            isActive={isTeamOneActive}
                            handicap={
                              props.state.teamOneHandicap
                                ? `H${props.state.teamOneHandicap > 0 ? '+' : ''}${props.state.teamOneHandicap}`
                                : ''
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <ProfileCard
                        isBorder={true}
                        imageUrl={props.state.sideOnePlayerOne.profilePhoto || defaultImages[0]}
                        size={70}
                        isActive={isTeamOneActive}
                        handicap={
                          props.state.teamOneHandicap
                            ? `H${props.state.teamOneHandicap > 0 ? '+' : ''}${props.state.teamOneHandicap}`
                            : ''
                        }
                      />
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <div
                      className={cn('h-[2px] w-1/2 rounded-full', isTeamOneActive ? 'bg-white' : 'bg-transparent')}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-medium text-box-trim text-[28px] leading-[130%] text-white drop-shadow-[0px_2px_4px_0px_#000000FA]">
                    {activeSet && activeSet?.teamOneScore}
                  </p>
                  <span className={cn('text-white/70 text-xs font-bold', isTeamOneActive ? '' : 'invisible')}>
                    BREAK {activeTurn && activeTurn?.score}
                  </span>
                </div>
              </div>
              <PlayerNameDisplay
                className={cn(
                  'font-medium text-[17px] leading-[130%] uppercase',
                  isTeamOneActive ? 'text-sandy-yellow' : 'text-score-text',
                )}
                playerOneName={getPlayerDisplayName(props.state.sideOnePlayerOne, isTeamOneDouble)}
                playerTwoName={
                  props.state.sideOnePlayerTwo
                    ? getPlayerDisplayName(props.state.sideOnePlayerTwo, isTeamOneDouble)
                    : undefined
                }
              />
            </div>
            {props.state.tournamentId && props.state.eventFormat === 'TEAMS' && (
              <div className="px-3 py-3 flex gap-3 items-center bg-[#272126]">
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
                    joinPlayerNames(
                      getPlayerDisplayName(props.state.sideOnePlayerOne, isTeamOneDouble),
                      props.state.sideOnePlayerTwo
                        ? getPlayerDisplayName(props.state.sideOnePlayerTwo, isTeamOneDouble)
                        : undefined,
                    )}
                </p>
              </div>
            )}
          </div>
          <div>
            <div className="p-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative space-y-2" style={{ flexShrink: 0 }}>
                  <div
                    className="relative"
                    style={isTeamTwoDouble ? { width: 90, height: 90 } : { width: 70, height: 70 }}
                  >
                    {isTeamTwoDouble ? (
                      <>
                        <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                          <ProfileCard
                            imageUrl={props.state.sideTwoPlayerOne.profilePhoto || defaultImages[2]}
                            size={60}
                            isActive={isTeamTwoActive}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
                          <ProfileCard
                            imageUrl={props.state.sideTwoPlayerTwo?.profilePhoto || defaultImages[3]}
                            size={60}
                            isActive={isTeamTwoActive}
                            handicap={
                              props.state.teamTwoHandicap
                                ? `H${props.state.teamTwoHandicap > 0 ? '+' : ''}${props.state.teamTwoHandicap}`
                                : ''
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <ProfileCard
                        imageUrl={props.state.sideTwoPlayerOne.profilePhoto || defaultImages[2]}
                        size={70}
                        isActive={isTeamTwoActive}
                        handicap={
                          props.state.teamTwoHandicap
                            ? `H${props.state.teamTwoHandicap > 0 ? '+' : ''}${props.state.teamTwoHandicap}`
                            : ''
                        }
                      />
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <div
                      className={cn('h-[2px] w-1/2 rounded-full', isTeamTwoActive ? 'bg-white' : 'bg-transparent')}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-box-trim text-[28px] leading-[130%] text-white drop-shadow-[0px_2px_4px_0px_#000000FA]">
                    {activeSet && activeSet?.teamTwoScore}
                  </p>

                  <span className={cn('text-white/70 text-xs font-bold', isTeamTwoActive ? '' : 'invisible')}>
                    BREAK {activeTurn && activeTurn?.score}
                  </span>
                </div>
              </div>
              <PlayerNameDisplay
                className={cn(
                  'font-medium text-[17px] leading-[130%] uppercase text-left',
                  isTeamTwoActive ? 'text-sandy-yellow' : 'text-score-text',
                )}
                playerOneName={getPlayerDisplayName(props.state.sideTwoPlayerOne, isTeamTwoDouble)}
                playerTwoName={
                  props.state.sideTwoPlayerTwo
                    ? getPlayerDisplayName(props.state.sideTwoPlayerTwo, isTeamTwoDouble)
                    : undefined
                }
              />
            </div>
            {props.state.tournamentId && props.state.eventFormat === 'TEAMS' && (
              <div className="px-3 py-3 flex justify-start gap-3 items-center bg-[#272126]">
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
                <p className="uppercase text-sm leading-[130%] text-white text-nowrap truncate">
                  {props.state.teamTwoName ||
                    joinPlayerNames(
                      getPlayerDisplayName(props.state.sideTwoPlayerOne, isTeamTwoDouble),
                      props.state.sideTwoPlayerTwo
                        ? getPlayerDisplayName(props.state.sideTwoPlayerTwo, isTeamTwoDouble)
                        : undefined,
                    )}
                </p>
              </div>
            )}
          </div>
        </div>
        {props.state.sport === 'SNOOKER' &&
          (() => {
            const teamOnePointTypes = getSnookerPointTypesByTurns(
              activeSet?.turns?.filter((value) =>
                [props.state!.sideOnePlayerOne, props.state!.sideOnePlayerTwo].some(
                  (player) => player && value.turnPlayerId === player.id,
                ),
              ) || [],
            );
            const teamTwoPointTypes = getSnookerPointTypesByTurns(
              activeSet?.turns?.filter((value) =>
                [props.state!.sideTwoPlayerOne, props.state!.sideTwoPlayerTwo].some(
                  (player) => player && value.turnPlayerId === player.id,
                ),
              ) || [],
            );

            if (!hasVisibleSnookerPoints(teamOnePointTypes) && !hasVisibleSnookerPoints(teamTwoPointTypes)) {
              return null;
            }

            return (
              <div className="grid grid-cols-2 w-full gap-3 py-4 pb-0 px-3">
                {/* Wrap in a div so this grid cell ALWAYS renders an element. SnookerPointTypeDisplay
                    returns null when a side has no balls yet; UNWRAPPED, that collapsed the grid to a
                    single child and the OTHER player's rack slid into the left column (balls shown under
                    the wrong player until both sides had potted). The wrapper keeps both columns fixed. */}
                <div className="">
                  <SnookerPointTypeDisplay
                    class={'gap-[0.3rem]'}
                    className={'text-[0.8rem] w-fit font-mono h-5 items-start'}
                    align="start"
                    isActive={isTeamOneActive}
                    activeTurnPointTypes={teamOnePointTypes}
                  />
                </div>

                <div className="">
                  <SnookerPointTypeDisplay
                    class={'gap-[0.3rem]'}
                    className={'text-[0.8rem] font-mono h-5 w-fit flex justify-center'}
                    align="start"
                    isActive={isTeamTwoActive}
                    activeTurnPointTypes={teamTwoPointTypes}
                  />
                </div>
              </div>
            );
          })()}
        <div className="p-3 space-y-2">
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
                className="w-full border border-white/[.12] px-3 py-2 rounded bg-[#202020] "
              >
                <div className="flex justify-between items-center">
                  <p className="uppercase text-xs leading-[130%] text-[#FFFBFE]/60 shrink-0 select-none">
                    Previous Frame Scores
                  </p>
                  {showPreviousFrames ? (
                    <ChevronIcon className="rotate-90 text-[#FFFBFE]/60 " />
                  ) : (
                    <ChevronIcon className="-rotate-90 text-[#FFFBFE]/60 " />
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

function joinPlayerNames(playerOneName: string, playerTwoName?: string) {
  return playerTwoName ? `${playerOneName.trim()} & ${playerTwoName.trim()}` : playerOneName.trim();
}

function PlayerNameDisplay({
  playerOneName,
  playerTwoName,
  className,
}: {
  playerOneName: string;
  playerTwoName?: string;
  className?: string;
}) {
  if (playerTwoName) {
    return (
      <div className="space-y-0.5">
        <p className={cn('flex items-baseline gap-[0.3ch]', className)}>
          <span className="min-w-0 truncate">{playerOneName.trim()}</span>
          <span className="shrink-0">&</span>
        </p>
        <p className={cn('truncate', className)}>{playerTwoName.trim()}</p>
      </div>
    );
  }

  return <p className={cn('truncate', className)}>{playerOneName.trim()}</p>;
}
