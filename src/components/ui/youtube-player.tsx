import { useEffect, useRef } from 'react';

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          mute: 1
        },
        events: {
          onReady: (event: any) => {
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

    return () => {
      delete (window as any).onYouTubeIframeAPIReady;
      document.body.removeChild(script);
    };
  }, [videoId]);

  return <div className='w-full h-full object-cover' ref={playerRef}></div>;
};

export default YouTubePlayer;
