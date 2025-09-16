import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState, StreamState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTube from 'react-youtube';
import 'rc-slider/assets/index.css';
import { VideoControls } from './Controls';
import { useYouTubePlayer } from '@/hooks/useYoutubePlayer';
import { TopOverlay } from './overlays/TopOverlay';
import { EcaTemplate } from './templates/Eca';
import { GeneralTemplate } from './templates/General';
import { SourceWithFinalScores } from './templates/SourceFinalScores';
import { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { BBSLTemplate } from './templates/BBSL';
import { SeekIndicator } from './SeekIndicator';
import { CatholicTemplate } from './templates/Catholic';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from '@radix-ui/react-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CatholicSinglesTemplate } from './templates/CatholicSingles';
import { NewEca } from './templates/Eca-new';
import { CatholicAprilTemplate } from './templates/CatholicApril';
import { CenturyTemplate } from './templates/Century';
import { NewEcaTemplate } from './templates/NewEca';
import { CatholicJune } from './templates/CatholicJune';
import { Singles } from './templates/Singles';
import { IGTemplate } from './templates/IG';

interface StreamContainerProps {
  state: StreamingState | null;
  isPortrait: boolean;
  timeLeft: number;
  showBottomScrubber: boolean;
  onVideoEnd: () => void;
  stopWatchTime: number;
  updateTimer: (timeInMillseconds: number) => void;
  isTv: boolean;
  startFromSeconds?: number;
}

export function StreamContainer(props: StreamContainerProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);

  const [lastTap, setLastTap] = useState<number>(0);
  const DOUBLE_TAP_DELAY = 300;

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  const {
    videoDuration,
    isSoundOn,
    isVideoPlaying,
    handleYouTubeReady,
    handleYouTubeStateChange,
    handleMuteUnmute,
    handlePlayPause,
    handleScrub,
    goLive,
    handleSwitchCamera,
  } = useYouTubePlayer({
    onTimerUpdate: props.updateTimer,
    isMatchLive: props.state && props.state.matchStatus === 'LIVE' ? true : false,
    matchStartTime: props.state && props.state.actualStartTimeDate ? props.state.actualStartTimeDate : null,
    onLoadingStateChange: setIsVideoLoading,
    startFromSeconds: props.startFromSeconds,
  });

  const [seekIndicator, setSeekIndicator] = useState<'left' | 'right' | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [stream, setStream] = useState<StreamState | null>(null);

  useEffect(() => {
    if (props.state?.streams) {
      setStream(props.state.streams.find((s) => s.isPrimary) ?? null);
    }
  }, [props.state]);

  useEffect(() => {
    if (seekIndicator) {
      const timer = setTimeout(() => {
        setSeekIndicator(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [seekIndicator]);

  const toggleOverlay = () => {
    setShowControls((prev) => !prev);
  };

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let x: number;

      if (e.type === 'touchend') {
        const touch = (e as React.TouchEvent).changedTouches[0];
        x = touch.clientX - rect.left;
      } else {
        x = (e as React.MouseEvent).clientX - rect.left;
      }

      const isLeftSide = x < rect.width / 2;
      if (isLeftSide) {
        setSeekIndicator('left');
        handleScrub(Math.max(0, props.stopWatchTime - 10000));
      } else {
        setSeekIndicator('right');
        handleScrub(Math.min(videoDuration, props.stopWatchTime + 10000));
      }
      setLastTap(0);
    } else {
      setLastTap(currentTime);
      toggleOverlay();
    }
  };

  const handleCameraAngleSwitch = useCallback(
    (stream: StreamState) => {
      if (stream.brodcastId === selectedStreamId) {
        return;
      }

      handleSwitchCamera(props.stopWatchTime);
      setSelectedStreamId(stream.brodcastId!);
    },
    [selectedStreamId, props.stopWatchTime, handleSwitchCamera],
  );

  return (
    <div
      className={clsx('w-full flex justify-center items-center', {
        'h-auto': props.isPortrait,
        'h-screen max-h-screen': !props.isPortrait,
      })}
    >
      {props.state && stream ? (
        <div className="relative flex justify-center items-center w-full h-full">
          {stream.streamType === StreamType.CLOUD_PROVIDER && stream.streamProvider === 'YOUTUBE' ? (
            <div
              className="relative w-full h-full max-w-full max-h-full overflow-hidden"
              style={{
                width: '100%',
                height: props.isPortrait ? '100%' : '100vh',
                aspectRatio: '16 / 9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {isVideoLoading && (
                <div className="absolute inset-0 z-40 bg-black">
                  <Skeleton className="w-full h-full" />
                </div>
              )}

              <YouTube
                videoId={selectedStreamId || stream.brodcastId!}
                id={selectedStreamId || stream.brodcastId!}
                onReady={handleYouTubeReady}
                onEnd={props.onVideoEnd}
                onStateChange={handleYouTubeStateChange}
                className="object-contain w-full h-full"
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    fs: 0,
                    modestbranding: 1,
                  },
                }}
              />
              {/* Overlay Content */}

              <div
                onClick={handleTap}
                onTouchEnd={handleTap}
                className="absolute inset-0 z-30 w-full h-full bg-transparent border-none margin-none"
              >
                <SeekIndicator direction="left" isVisible={seekIndicator === 'left'} />
                <SeekIndicator direction="right" isVisible={seekIndicator === 'right'} />
              </div>

              {stream.overlayType === 'DESTINATION' && !props.isPortrait && (
                <TopOverlay
                  clubLogo={props.state.clubLogo!}
                  tournamentLogo={props.state.tournamentLogo}
                  venueNo={props.state.venueNo!}
                />
              )}

              {stream.overlayType === 'DESTINATION' &&
                !props.isPortrait &&
                (props.state.tournamentId ? (
                  {
                    '671f4acf089a3a701c79071f': (
                      <EcaTemplate
                        teamOneLogo={props.state.teamOneLogo}
                        teamTwoLogo={props.state.teamTwoLogo}
                        activePlayerId={props.state.activePlayerId}
                        activeTurn={activeTurn}
                        tournamentName={props.state.tournamentName!}
                        sideOnePlayerOne={props.state.sideOnePlayerOne}
                        sideTwoPlayerOne={props.state.sideTwoPlayerOne}
                        isTeamOneHandicapApplied={props.state.isTeamOneHandicapApplied!}
                        isTeamTwoHandicapApplied={props.state.isTeamTwoHandicapApplied!}
                        teamOneHandicap={props.state.teamOneHandicap!}
                        teamTwoHandicap={props.state.teamTwoHandicap!}
                        maxScorePerSet={props.state.maxScorePerSet!}
                        teamOneScore={props.state.teamOneScore}
                        teamTwoScore={props.state.teamTwoScore}
                      />
                    ),
                    '679321b846b356ef640ca3d2': (
                      <BBSLTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '679b307af7eaaf399004a914': (
                      <BBSLTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '679ce81ed0202e686e8a96f6': (
                      <CatholicTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '67c68050f08592439d5c5a55': (
                      <CatholicSinglesTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '67ee7037eb254339e7ee8857': (
                      <NewEca
                        state={props.state}
                        isTv={props.isTv}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '681a27430799a4ccbfb175fa': (
                      <CatholicAprilTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '681a3e790799a4ccbfb17615': (
                      <CenturyTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '68298983ffe9aacb1655b1f4': (
                      <CenturyTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '681631fef773a447a1e34254': (
                      <NewEcaTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '68496e3c945ee0fb4985fca4': (
                      <CatholicJune
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '6818b4cef773a447a1e34373': (
                      <Singles
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '6874b2bc4c0c210729491427': (
                      <Singles
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    ),
                    '68ac0599c8a52eb65477c05f': (
                      <IGTemplate
                        isTv={props.isTv}
                        state={props.state}
                        activeTurn={activeTurn}
                        activeSet={activeSet}
                      />
                    )
                  }[props.state.tournamentId] || (
                    <GeneralTemplate
                      state={props.state}
                      activeSet={activeSet}
                      activeTurn={activeTurn}
                      isTv={props.isTv}
                    />
                  )
                ) : (
                  <GeneralTemplate
                    state={props.state}
                    activeSet={activeSet}
                    activeTurn={activeTurn}
                    isTv={props.isTv}
                  />
                ))}
              {stream.overlayType === 'SOURCE_WITH_FINAL_SCORES' && !props.isPortrait && (
                <SourceWithFinalScores state={props.state} />
              )}
              {showControls && (
                <VideoControls
                  onInactive={() => {
                    setShowControls(false);
                  }}
                  isVideoPlaying={isVideoPlaying}
                  isSoundOn={isSoundOn}
                  videoDuration={videoDuration}
                  onLiveClick={goLive}
                  currentTime={props.stopWatchTime}
                  onSliderChange={handleScrub}
                  onMuteUnmuteClick={handleMuteUnmute}
                  onPlayPauseClick={handlePlayPause}
                  isStreamLive={true}
                  isMatchTypeLive={props.state.matchStatus === 'LIVE'}
                  streams={props.state.streams}
                  onCameraSwitch={handleCameraAngleSwitch}
                  selectedStreamId={selectedStreamId || stream?.brodcastId}
                />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <video
          autoPlay
          loop
          muted
          src="https://clubliv.blr1.cdn.digitaloceanspaces.com/SponsorVideos/ECA%20Raman%20Nair%202024%20Gina%20Artize.mp4"
          className="w-full h-auto"
        />
      )}

      {props.isPortrait && props.state && props.state.streams.length > 1 && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 rounded-lg overflow-hidden">
              <div className="bg-[#424242] flex gap-2 justify-center items-center p-3">
                <img src="/switch-icon.png" alt="stream" className="w-6 h-6" />
                <span className="text-white text-sm">Change Video Angle</span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="absolute bottom-20 w-[60%] rounded-lg overflow-hidden transform -translate-x-1/2 left-1/2">
            <DialogTitle></DialogTitle>

            <div className="bg-[#424242] flex gap-4 p-3 items-center justify-center">
              {props.state.streams.map((streamItem) => (
                <DialogClose className="cursor-pointer p-0 outline-none border-none" key={streamItem.brodcastId}>
                  <div
                    key={streamItem.brodcastId}
                    onClick={() => handleCameraAngleSwitch(streamItem)}
                    className={clsx(
                      streamItem.brodcastId === (selectedStreamId || stream?.brodcastId)
                        ? 'bg-white border-white'
                        : 'bg-transparent border-transparent',
                      'border-2 rounded-lg overflow-hidden cursor-pointer',
                    )}
                  >
                    <img
                      src={streamItem.isPrimary ? '/primary-angle.png' : '/secondnary-angle.png'}
                      alt="stream"
                      className="w-14 h-14"
                    />
                  </div>
                </DialogClose>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
