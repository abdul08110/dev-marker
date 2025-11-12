import { useEffect, useRef, useState, useCallback } from 'react';
import mqtt from 'mqtt';
import { Player, Set, TournamentItem, TournamentSubItem, TournamentPhase } from '@/stores/types';
import useGetCameraRtspUrlAndWebsocketUrl from '@/api/app/useGetCameraRtspUrlAndWebsocketUrl';
import useGetMatchLiveData, { StreamType } from '@/api/app/useGetMatchData';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';
import useGetMatchStreams from '@/api/app/useGetStreamInfoMarker';
import useGetSponsorshipVideo from '@/api/app/useGetSponsorshipVideo';
import { toast } from '@/components/ui/use-toast';
import useTimer from './useTimer';

export interface StreamState {
    streamType: StreamType;
    streamProvider: 'YOUTUBE' | 'MUX';
    streamUrl?: string;
    isPrimary: boolean;
    brodcastId?: string;
    overlayType: 'SOURCE' | 'DESTINATION' | 'SOURCE_WITH_FINAL_SCORES';
}

export interface StreamingState {
    matchId: string;
    sport: 'BILLIARDS' | 'SNOOKER';
    sportType: 'SNOOKER_10_RED' | 'SNOOKER_15_RED' | 'SNOOKER_6_RED';
    sideOnePlayerOne: Player;
    sideOnePlayerTwo: Player | null;
    sideTwoPlayerOne: Player;
    sideTwoPlayerTwo: Player | null;
    activePlayerId: string | null;
    teamOneScore: number;
    teamTwoScore: number;
    matchStatus: 'LIVE' | 'COMPLETED';
    sets: Set[];
    showPlayerMatchHistory?: boolean;
    venueNo: number | null;
    clubName: string | null;
    noOfFrames: number | null;
    actualStartTimeDate: string;
    actualEndTimeDate: string | null;
    clubLogo: string | null;
    tournamentLogo: string | null;
    teamOneLogo: string | null;
    teamTwoLogo: string | null;
    tournamentTeamOneScore: number | null;
    tournamentTeamTwoScore: number | null;
    tournamentTeamOneabb: string | null;
    tournamentTeamTwoabb: string | null;
    teamOneHandicap: number | null;
    teamTwoHandicap: number | null;
    handicap: number;
    maxScorePerSet: number | null;
    isTeamOneHandicapApplied?: boolean;
    isTeamTwoHandicapApplied?: boolean;
    tournamentName: string | null;
    tournamentId: string | null;
    teamOneName: string | null;
    teamTwoName: string | null;
    tournamentTeamOneId: string | null;
    tournamentTeamTwoId: string | null;
    format: string | null;
    expectedEndTimeDate: string | null;
    tournamentSubItem?: TournamentSubItem & {
        tournamentItem: TournamentItem & {
            tournamentPhase: TournamentPhase & {
                tournamentFormats: [
                    {
                        id: string;
                    }
                ]
            };
        };
    };
    phase: string | null;
    streams: StreamState[];
    eventFormat: 'SINGLES' | 'TEAMS';
}

interface UseCommentaryProps {
    venueId?: string;
    autoConnect?: boolean;
}

interface UseCommentaryReturn {
    // State
    loading: boolean;
    isSocketConnected: boolean;
    isRecording: boolean;
    isPaused: boolean;
    hasPermission: boolean;
    cameraRtspUrl: string | null;
    socketUrl: string | null;
    error: string | null;
    streamingData: StreamingState | null;
    isInitialized: boolean;
    isMatchLive: boolean;
    timeLeft: number;
    sponsorshipVideoUrl: string | null;
    
    // Actions
    checkPermission: () => Promise<boolean>;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    copyRtspUrl: () => Promise<boolean>;
}

const useCommentary = ({
    venueId,
    autoConnect = true,
}: UseCommentaryProps = {}): UseCommentaryReturn => {
    // WebSocket references (for audio streaming)
    const wsRef = useRef<WebSocket | null>(null);
    
    // MQTT reference (for venue updates)
    const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
    
    // Audio references
    const ctxRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    
    // State management
    const [loading, setLoading] = useState<boolean>(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const [cameraRtspUrl, setCameraRtspUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [streamingData, setStreamingData] = useState<StreamingState | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isMatchLive, setIsMatchLive] = useState(false);
    const [sponsorshipVideoUrl, setSponsorshipVideoUrl] = useState<string | null>(null);
    
    // Refs for tracking state
    const streamingDataRef = useRef<StreamingState | null>(null);
    
    // API Hooks
    const { getCameraRtspUrlAndWebsocketUrl } = useGetCameraRtspUrlAndWebsocketUrl();
    const getLiveMatchHook = useGetMatchLiveData();
    const getMatchStreamsHook = useGetMatchStreams();
    const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
    const getSponsorshipVideoHook = useGetSponsorshipVideo();
    
    // Timer for match duration
    const timeLeft = useTimer({
        endTime: streamingData && streamingData.expectedEndTimeDate ? new Date(streamingData.expectedEndTimeDate) : null,
        startTime: streamingData && streamingData.matchStatus === 'COMPLETED' ? new Date(streamingData.actualStartTimeDate) : null,
        onTimerComplete: () => {},
    });

    // Update streamingDataRef when streamingData changes
    useEffect(() => {
        streamingDataRef.current = streamingData;
    }, [streamingData]);

    // Handle MQTT messages for venue updates
    const handleMqttMessage = useCallback((topic: string, message: string) => {
        const parsedMessage = JSON.parse(message);
        const topicWithoutId = topic.split('/')[1];

        switch (topicWithoutId) {
            case 'send-data':
                setStreamingData((prevData) => {
                    if (prevData === null) return null;
                    return {
                        ...prevData,
                        activePlayerId: parsedMessage.activePlayerId,
                        teamOneScore: parsedMessage.teamOneScore,
                        teamTwoScore: parsedMessage.teamTwoScore,
                        sets: parsedMessage.sets || prevData.sets,
                    };
                });
                break;
            case 'match-start':
                if (venueId) {
                    // Fetch new match data when a new match starts
                    getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(venueId).then((res) => {
                        if (res && res.matchId) {
                            // Will be handled by fetchMatchData
                            window.location.reload(); // Reload to fetch fresh data
                        }
                    });
                }
                break;
            case 'match-end':
                console.log('⚠️ Match ended - cleaning up in 20 seconds...');
                setStreamingData((prev) => prev ? { ...prev, matchStatus: 'COMPLETED' } : null);
                setIsMatchLive(false);
                // Stop recording
                if (workletNodeRef.current) {
                    workletNodeRef.current.disconnect();
                }
                if (ctxRef.current) {
                    ctxRef.current.close();
                }
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }
                setIsRecording(false);
                setIsPaused(false);
                // Disconnect socket
                if (wsRef.current) {
                    wsRef.current.close();
                    wsRef.current = null;
                    setIsSocketConnected(false);
                }
                break;
        }
    }, [venueId, getMarkerLiveMatchesByVenueHookData]);

    // MQTT Connection for venue updates
    const connectToMqtt = useCallback((topics: string[]) => {
        const brokerUrl = import.meta.env.VITE_MQTT_URL;
        mqttClientRef.current = mqtt.connect(brokerUrl, {
            keepalive: 60,
            reconnectPeriod: 2000,
        });

        mqttClientRef.current.on('connect', () => {
            console.log('✅ Connected to MQTT broker');
            topics.forEach((topic) => {
                mqttClientRef.current?.subscribe(topic, (err) => {
                    if (err) console.error(`Subscription error for topic ${topic}: ${err.message}`);
                    else console.log(`Subscribed to topic ${topic}`);
                });
            });
        });

        mqttClientRef.current.on('message', (topic, message) => {
            handleMqttMessage(topic, message.toString());
        });

        mqttClientRef.current.on('error', (err) => {
            console.error('❌ MQTT Error:', err);
            mqttClientRef.current?.end();
        });

        mqttClientRef.current.on('close', () => {
            console.log('Disconnected from MQTT broker');
        });
    }, [handleMqttMessage]);

    // Disconnect MQTT
    const disconnectMqtt = useCallback(() => {
        if (mqttClientRef.current) {
            mqttClientRef.current.end();
            mqttClientRef.current = null;
        }
    }, []);

    // Connect to WebSocket (internal - for audio streaming)
    const connectSocket = useCallback((url: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log('⚠️ WebSocket already connected');
            return;
        }

        try {
            wsRef.current = new WebSocket(url);
            wsRef.current.binaryType = 'arraybuffer';

            wsRef.current.onopen = () => {
                console.log('✅ Connected to commentary server');
                setIsSocketConnected(true);
                setError(null);
            };

            wsRef.current.onclose = () => {
                console.log('❌ Disconnected from commentary server');
                setIsSocketConnected(false);
            };

            wsRef.current.onerror = (event) => {
                console.error('❌ WebSocket error:', event);
                setError('WebSocket connection error');
                setIsSocketConnected(false);
            };
        } catch (err: any) {
            console.error('❌ Failed to connect:', err);
            setError(`Connection failed: ${err.message}`);
        }
    }, []);

    // Disconnect WebSocket (internal)
    const disconnectSocket = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setIsSocketConnected(false);
        }
    }, []);

    // Fetch match data by matchId
    const fetchMatchData = useCallback(async (matchId: string) => {
        setLoading(true);
        try {
            const res = await getLiveMatchHook.getLiveMatchData({ matchId });
            const streamRes = await getMatchStreamsHook.getLiveStreamData({ matchId });
            const sponsorshipVideoRes = await getSponsorshipVideoHook.getSponsorshipVideo({ matchId });

            if (sponsorshipVideoRes) {
                setSponsorshipVideoUrl(sponsorshipVideoRes.videoUrl);
            }

            if (res && streamRes) {
                const initialData: StreamingState = {
                    matchId: matchId,
                    sport: res.sport,
                    sideOnePlayerOne: res.sideOnePlayerOne,
                    sideTwoPlayerOne: res.sideTwoPlayerOne,
                    sideOnePlayerTwo: res.sideOnePlayerTwo,
                    sideTwoPlayerTwo: res.sideTwoPlayerTwo,
                    activePlayerId: res.activePlayerId,
                    teamOneScore: res.teamOneScore,
                    teamTwoScore: res.teamTwoScore,
                    sets: res.sets,
                    matchStatus: res.matchStatus,
                    venueNo: res.venue ? res.venue.no : null,
                    clubName: res.club ? res.club.name : null,
                    noOfFrames: res.noOfSets,
                    actualStartTimeDate: res.actualStartTimeDate,
                    actualEndTimeDate: res.actualEndTimeDate,
                    clubLogo: res.club && res.club.imageUrl ? res.club.imageUrl : null,
                    tournamentLogo: res.tournament && res.tournament.logo ? res.tournament.logo : null,
                    teamOneLogo: res.tournamentTeamOne && res.tournamentTeamOne.logo ? res.tournamentTeamOne.logo : null,
                    teamTwoLogo: res.tournamentTeamTwo && res.tournamentTeamTwo.logo ? res.tournamentTeamTwo.logo : null,
                    tournamentTeamOneScore: res.tournamentTeamOneScore ? res.tournamentTeamOneScore : null,
                    tournamentTeamTwoScore: res.tournamentTeamTwoScore ? res.tournamentTeamTwoScore : null,
                    tournamentTeamOneabb: res.tournamentTeamOne && res.tournamentTeamOne.code ? res.tournamentTeamOne.code : null,
                    tournamentTeamTwoabb: res.tournamentTeamTwo && res.tournamentTeamTwo.code ? res.tournamentTeamTwo.code : null,
                    teamOneHandicap: res.teamOneHandicap ? res.teamOneHandicap : null,
                    teamTwoHandicap: res.teamTwoHandicap ? res.teamTwoHandicap : null,
                    sportType: res.sportType,
                    handicap: res.handicap,
                    maxScorePerSet: res.maxScorePerSet,
                    isTeamOneHandicapApplied: res.isTeamOneHandicapApplied,
                    isTeamTwoHandicapApplied: res.isTeamTwoHandicapApplied,
                    tournamentName: res.tournament ? res.tournament.name : null,
                    tournamentId: res.tournament ? res.tournament.id : null,
                    teamOneName: res.tournamentTeamOne ? res.tournamentTeamOne.name : null,
                    teamTwoName: res.tournamentTeamTwo ? res.tournamentTeamTwo.name : null,
                    expectedEndTimeDate: res.expectedEndTimeDate ? res.expectedEndTimeDate : null,
                    format: res.format ? res.format : null,
                    tournamentSubItem: res.tournamentSubItem,
                    tournamentTeamOneId: res.tournamentTeamOneId ? res.tournamentTeamOneId : null,
                    tournamentTeamTwoId: res.tournamentTeamTwoId ? res.tournamentTeamTwoId : null,
                    streams: streamRes.streams,
                    phase: res.phase ? res.phase : null,
                    eventFormat: res.tournament ? res.tournament.eventFormat : 'TEAMS',
                };

                setStreamingData(initialData);
                setIsMatchLive(res.matchStatus === 'LIVE');

                // If match is live, connect to MQTT for updates
                if (res.matchStatus === 'LIVE' && !venueId) {
                    const venueTopics = [`${res.venueId}/send-data`, `${res.venueId}/match-end`];
                    connectToMqtt(venueTopics);
                }

                // Fetch commentary URLs if match is live
                if (res.matchStatus === 'LIVE' && autoConnect) {
                    try {
                        const config = await getCameraRtspUrlAndWebsocketUrl({ matchId });
                        if (config) {
                            if (config.cameraRtspUrl) {
                                setCameraRtspUrl(config.cameraRtspUrl);
                            }
                            if (config.websocketUrl) {
                                setSocketUrl(config.websocketUrl);
                                connectSocket(config.websocketUrl);
                            }
                            setIsInitialized(true);
                        }
                    } catch (err: any) {
                        console.error('❌ Failed to fetch commentary configuration:', err);
                        setError(`Failed to fetch commentary URLs: ${err.message}`);
                    }
                }
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to load match data. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching match data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load match data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [getLiveMatchHook, getMatchStreamsHook, getSponsorshipVideoHook, getCameraRtspUrlAndWebsocketUrl, venueId, autoConnect, connectToMqtt, connectSocket]);

    // Fetch active match for venue
    const fetchActiveMatchForVenue = useCallback(async (venueId: string) => {
        setLoading(true);
        try {
            const res = await getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(venueId);
            if (res && res.matchId) {
                await fetchMatchData(res.matchId);
            } else {
                setStreamingData(null);
                setIsMatchLive(false);
            }
        } catch (error) {
            console.error('Error fetching active match data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load active match data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [getMarkerLiveMatchesByVenueHookData, fetchMatchData]);

    // Check microphone permission
    const checkPermission = useCallback(async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            setError(null);
            return true;
        } catch (err: any) {
            console.error('❌ Microphone permission denied:', err);
            setHasPermission(false);
            setError(`Microphone permission denied: ${err.message}`);
            return false;
        }
    }, []);

    // Start recording
    const startRecording = useCallback(async () => {
        if (!isSocketConnected) {
            setError('Cannot start recording: WebSocket not connected');
            return;
        }

        if (!hasPermission) {
            const granted = await checkPermission();
            if (!granted) return;
        }

        try {
            // Get microphone stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // Force 48kHz to match GStreamer caps
            const ctx = new AudioContext({ sampleRate: 48000 });
            await ctx.audioWorklet.addModule('/recorderWorklet.js');

            const source = ctx.createMediaStreamSource(stream);

            // Worklet for PCM16 conversion
            const workletNode = new AudioWorkletNode(ctx, 'pcm-worklet');

            workletNode.port.onmessage = (event) => {
                if (isPaused) return; // Don't send audio when paused
                
                const buffer = event.data as ArrayBuffer;
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    // Send raw PCM16 ArrayBuffer directly
                    wsRef.current.send(buffer);
                }
            };

            // Connect mic → worklet
            source.connect(workletNode);

            // Keep references
            ctxRef.current = ctx;
            workletNodeRef.current = workletNode;
            setIsRecording(true);
            setError(null);

            console.log('🎙 PCM Recorder started (48kHz, mono, Int16)');
        } catch (err: any) {
            console.error('❌ Failed to start recording:', err);
            setError(`Recording failed: ${err.message}`);
        }
    }, [isSocketConnected, hasPermission, isPaused, checkPermission]);

    // Stop recording
    const stopRecording = useCallback(() => {
        try {
            workletNodeRef.current?.disconnect();
            ctxRef.current?.close();
            
            // Stop all media tracks
            mediaStreamRef.current?.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
            
            setIsRecording(false);
            setIsPaused(false);
            console.log('⏹ PCM Recorder stopped');
        } catch (err: any) {
            console.error('❌ Failed to stop recording:', err);
            setError(`Stop recording failed: ${err.message}`);
        }
    }, []);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (isRecording && !isPaused) {
            setIsPaused(true);
            console.log('⏸ Recording paused');
        }
    }, [isRecording, isPaused]);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (isRecording && isPaused) {
            setIsPaused(false);
            console.log('▶️ Recording resumed');
        }
    }, [isRecording, isPaused]);

    // Copy RTSP URL to clipboard
    const copyRtspUrl = useCallback(async (): Promise<boolean> => {
        if (!cameraRtspUrl) return false;
        
        try {
            await navigator.clipboard.writeText(cameraRtspUrl);
            return true;
        } catch (err) {
            console.error('Failed to copy RTSP URL:', err);
            setError('Failed to copy RTSP URL to clipboard');
            return false;
        }
    }, [cameraRtspUrl]);

    // Initialize on mount - fetch match data for venue
    useEffect(() => {
        if (venueId) {
            fetchActiveMatchForVenue(venueId);
            const topics = [`${venueId}/send-data`, `${venueId}/match-start`, `${venueId}/match-end`];
            connectToMqtt(topics);
        }

        return () => {
            disconnectMqtt();
        };
    }, [venueId]);

    // Auto-check permission on mount
    useEffect(() => {
        checkPermission();
    }, [checkPermission]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording();
            }
            disconnectSocket();
            disconnectMqtt();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        // State
        loading,
        isSocketConnected,
        isRecording,
        isPaused,
        hasPermission,
        cameraRtspUrl,
        socketUrl,
        error,
        streamingData,
        isInitialized,
        isMatchLive,
        timeLeft,
        sponsorshipVideoUrl,
        
        // Actions
        checkPermission,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        copyRtspUrl,
    };
};

export default useCommentary;