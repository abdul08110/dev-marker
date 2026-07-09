import { useEffect, useRef } from 'react';

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      (window as any).onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    };

    const createPlayer = () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }

      playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
        videoId: videoId,
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          mute: 1,
          vq: 'hd1080',
        },
        events: {
          onReady: (event: any) => {
            // Force 1080p quality minimum
            if (event.target.setPlaybackQuality) {
              event.target.setPlaybackQuality('hd1080');
            }
            if (event.target.setPlaybackQualityRange) {
              event.target.setPlaybackQualityRange('hd1080', 'highres');
            }
            event.target.playVideo();
          },
          onError: (event: any) => {
            if (event.data === 150 || event.data === 101) {
              console.error('Embedding is restricted by the video owner.');
              alert('This video cannot be embedded and must be viewed on YouTube.');
            }
          },
        },
      });
    };

    if (!(window as any).YT) {
      loadYouTubeAPI();
    } else {
      createPlayer();
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId]);

  return <div className='w-full h-full object-cover' ref={playerRef}></div>;
};

export default YouTubePlayer;