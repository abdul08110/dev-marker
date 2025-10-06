import { useState } from 'react';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { PortraitView } from '@/components/sections/stream/PortraitView';
import useCommentary from '@/hooks/useCommentary';
import { useSearchParams } from 'react-router-dom';
import {  Copy, Mic, MicOff, Pause, Play, Video, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export function Commentary() {
  const [searchParams] = useSearchParams();
  const searchParamsVenueId = searchParams.get('venueId');
  const { toast } = useToast();

  const {
    loading,
    isSocketConnected,
    isRecording,
    isPaused,
    hasPermission,
    error,
    cameraRtspUrl,
    streamingData,
    isMatchLive,
    timeLeft,
    checkPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    copyRtspUrl,
  } = useCommentary({
    venueId: searchParamsVenueId || undefined,
    autoConnect: true,
  });

  const [showControls, setShowControls] = useState(false);
  const hasMatchData = !!streamingData;

  const handleCopyRtspUrl = async () => {
    const success = await copyRtspUrl();
    if (success) {
      toast({
        title: "Copied!",
        description: "RTSP URL copied to clipboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to copy RTSP URL",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <SnookerMarkingLoading />;
  }

  // No match found state
  if (!hasMatchData) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
            <CardTitle className="text-white">No Active Match</CardTitle>
            <CardDescription>
              Waiting for a match to start on venue {searchParamsVenueId || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-2">
              <Skeleton className="w-2 h-2 rounded-full bg-blue-500" />
              <Skeleton className="w-2 h-2 rounded-full bg-blue-500" />
              <Skeleton className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Match not live yet state
  if (!isMatchLive) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-2" />
            <CardTitle className="text-white">Match Not Started</CardTitle>
            <CardDescription>
              Match status: <span className="text-orange-400 font-semibold">{streamingData.matchStatus}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">
              Commentary will be available once the match goes live
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_400px] h-full">
        {/* Left Side - Portrait View */}
        <div className="bg-black flex items-center justify-center overflow-hidden">
          <div className="w-full h-full max-w-2xl mx-auto">
            <PortraitView state={streamingData} timeLeft={timeLeft} />
          </div>
        </div>

        {/* Right Side - Commentary Controls */}
        <div className="bg-gray-900 border-l border-gray-800 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Mic className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Commentary Booth</h1>
                <p className="text-sm text-purple-100">Venue {streamingData.venueNo}</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* RTSP URL Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center">
                  <Video className="w-5 h-5 mr-2 text-blue-400" />
                  Camera RTSP URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cameraRtspUrl ? (
                  <>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300 break-all border border-gray-700">
                      {cameraRtspUrl}
                    </div>
                    <Button
                      onClick={handleCopyRtspUrl}
                      className="w-full"
                      variant="default"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy for VLC
                    </Button>
                  </>
                ) : (
                  <Skeleton className="h-20" />
                )}
              </CardContent>
            </Card>

            {/* Status Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusIndicator
                  label="Microphone Permission"
                  status={hasPermission ? 'success' : 'error'}
                  text={hasPermission ? 'Granted' : 'Not Granted'}
                />
                <StatusIndicator
                  label="Server Connection"
                  status={isSocketConnected ? 'success' : 'warning'}
                  text={isSocketConnected ? 'Connected' : 'Disconnected'}
                />
                <StatusIndicator
                  label="Recording Status"
                  status={isRecording ? (isPaused ? 'warning' : 'success') : 'idle'}
                  text={isRecording ? (isPaused ? 'Paused' : 'Live') : 'Stopped'}
                />
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="bg-red-500/10 border-red-500/50">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-400 font-semibold text-sm mb-1">Error</h4>
                      <p className="text-red-300 text-xs">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!hasPermission && (
                  <Button
                    onClick={checkPermission}
                    className="w-full"
                    variant="secondary"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Request Permission
                  </Button>
                )}

                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    disabled={!isSocketConnected || !hasPermission}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Commentary
                  </Button>
                ) : (
                  <>
                    {!isPaused ? (
                      <Button
                        onClick={pauseRecording}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeRecording}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button
                      onClick={stopRecording}
                      className="w-full bg-red-600 hover:bg-red-700"
                      variant="destructive"
                    >
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-full">
        {/* Portrait View */}
        <div className="flex-1 bg-black overflow-hidden">
          <PortraitView state={streamingData} timeLeft={timeLeft} />
        </div>

        {/* Floating Controls Toggle */}
        <Button
          onClick={() => setShowControls(!showControls)}
          className={`fixed bottom-4 right-4 z-40 rounded-full h-14 w-14 bg-purple-600 hover:bg-purple-700 shadow-lg ${
            showControls ? 'hidden' : 'flex'
          } items-center justify-center`}
          size="icon"
        >
          <Mic className="w-6 h-6" />
        </Button>

        {/* Mobile Controls Drawer */}
        {showControls && (
          <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowControls(false)}
            />

            {/* Drawer */}
            <div className="relative w-full bg-gray-900 rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
              {/* Handle */}
              <div className="sticky top-0 bg-gray-900 pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Mic className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Commentary</h2>
                  </div>
                  <Button
                    onClick={() => setShowControls(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>

                {/* RTSP URL */}
                {cameraRtspUrl && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center">
                        <Video className="w-4 h-4 mr-2" />
                        RTSP URL
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="bg-gray-900 rounded p-2 font-mono text-xs text-gray-300 break-all">
                        {cameraRtspUrl}
                      </div>
                      <Button
                        onClick={handleCopyRtspUrl}
                        className="w-full"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Status */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-4 space-y-2">
                    <StatusIndicator
                      label="Permission"
                      status={hasPermission ? 'success' : 'error'}
                      text={hasPermission ? 'OK' : 'Denied'}
                      compact
                    />
                    <StatusIndicator
                      label="Connection"
                      status={isSocketConnected ? 'success' : 'warning'}
                      text={isSocketConnected ? 'OK' : 'Off'}
                      compact
                    />
                    <StatusIndicator
                      label="Recording"
                      status={isRecording ? (isPaused ? 'warning' : 'success') : 'idle'}
                      text={isRecording ? (isPaused ? 'Paused' : 'Live') : 'Off'}
                      compact
                    />
                  </CardContent>
                </Card>

                {/* Error */}
                {error && (
                  <Card className="bg-red-500/10 border-red-500/50">
                    <CardContent className="pt-4">
                      <p className="text-red-300 text-xs">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Controls */}
                <div className="space-y-2 pt-2">
                  {!hasPermission && (
                    <Button
                      onClick={checkPermission}
                      className="w-full"
                      variant="secondary"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Request Permission
                    </Button>
                  )}

                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={!isSocketConnected || !hasPermission}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Commentary
                    </Button>
                  ) : (
                    <>
                      {!isPaused ? (
                        <Button
                          onClick={pauseRecording}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={resumeRecording}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Resume
                        </Button>
                      )}
                      <Button
                        onClick={stopRecording}
                        className="w-full"
                        variant="destructive"
                      >
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={() => setShowControls(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Status Indicator Component
interface StatusIndicatorProps {
  label: string;
  status: 'success' | 'error' | 'warning' | 'idle';
  text: string;
  compact?: boolean;
}

function StatusIndicator({ label, status, text, compact = false }: StatusIndicatorProps) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    idle: 'bg-gray-500',
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
          <span className="text-white">{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <div className={`w-2.5 h-2.5 rounded-full ${colors[status]} ${status === 'success' ? 'animate-pulse' : ''}`} />
        <span className="text-white text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}