import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTube from 'react-youtube';
import 'rc-slider/assets/index.css';
import { VideoControls } from './Controls';
import { useYouTubePlayer } from '@/hooks/useYoutubePlayer';
import { TopOverlay } from './overlays/TopOverlay';
import { EcaTemplate } from './templates/Eca';
import { GeneralTemplate } from './templates/General';
import { SourceWithFinalScores } from './templates/SourceFinalScores';
import { useState } from 'react';
import clsx from 'clsx';

interface StreamContainerProps {
  state: StreamingState | null;
  isPortrait: boolean;
  timeLeft: number;
  showBottomScrubber: boolean;
  onVideoEnd: () => void;
  stopWatchTime: number;
  updateTimer: (timeInMillseconds: number) => void;
}

export function StreamContainer(props: StreamContainerProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);

  const {
    videoDuration,
    isSoundOn,
    isVideoPlaying,
    handleYouTubeReady,
    handleYouTubeStateChange,
    handleMuteUnmute,
    handlePlayPause,
    handleScrub,
  } = useYouTubePlayer({
    onTimerUpdate: props.updateTimer,
    isMatchLive: props.state && props.state.matchStatus === 'LIVE' ? true : false,
    matchStartTime: props.state && props.state.actualStartTimeDate ? props.state.actualStartTimeDate : null,
  });

  const [isOverlayEnabled, setIsOverlayEnabled] = useState<boolean>(true);

  const toogleOverlay = async () => {
    setIsOverlayEnabled(!isOverlayEnabled);
  };

  return (
    <div className={clsx("w-full flex justify-center items-center", {
      'h-auto': props.isPortrait,
      'h-full': !props.isPortrait
    })}>
      {props.state ? (
        <div className="relative flex justify-center items-center w-full h-full">
          {props.state.streamType === StreamType.CLOUD_PROVIDER &&
          props.state.streamData !== null &&
          props.state.streamData !== undefined &&
          props.state.streamData.provider &&
          props.state.streamData.provider === 'YOUTUBE' ? (
            <div
              className="relative w-full h-full max-w-full max-h-full overflow-hidden"
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16 / 9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <YouTube
                videoId={props.state.streamData.brodcastId!}
                id={props.state.streamData.brodcastId!}
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

              <div onClick={toogleOverlay} className="absolute inset-0 z-30 w-full h-full"></div>

              {props.state.overlayType === 'DESTINATION' && !props.isPortrait && (
                <TopOverlay
                  clubLogo={props.state.clubLogo!}
                  tournamentLogo={props.state.tournamentLogo}
                  venueNo={props.state.venueNo!}
                />
              )}

              {props.state.overlayType === 'DESTINATION' &&
                !props.isPortrait &&
                isOverlayEnabled &&
                (props.state.tournamentId === '671f4acf089a3a701c79071f' ? (
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
                ) : (
                  <GeneralTemplate state={props.state} activeSet={activeSet} activeTurn={activeTurn} timeLeft={props.timeLeft} />
                ))}
              {props.state.overlayType === 'SOURCE_WITH_FINAL_SCORES' && !props.isPortrait && isOverlayEnabled && (
                <SourceWithFinalScores state={props.state} />
              )}
              {!isOverlayEnabled && (
                <VideoControls
                  isVideoPlaying={isVideoPlaying}
                  isSoundOn={isSoundOn}
                  videoDuration={videoDuration}
                  currentTime={props.stopWatchTime}
                  onSliderChange={handleScrub}
                  onMuteUnmuteClick={handleMuteUnmute}
                  onPlayPauseClick={handlePlayPause}
                  isStreamLive={true}
                  isMatchTypeLive={props.state.matchStatus === 'LIVE'}
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
    </div>
  );
}
