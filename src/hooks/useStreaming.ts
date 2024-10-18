import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import useGetMatchLiveData, { StreamData, StreamType } from '@/api/app/useGetMatchData';
import { toast } from '@/components/ui/use-toast';
import { Player, Set } from '@/stores/types';
import useMarkerGetLiveMatchByVenue from '@/api/home/useGetLiveMatchByVenueId';

export interface StreamingState {
  matchId: string;
  sport: 'BILLIARDS' | 'SNOOKER';
  sideOnePlayerOne: Player;
  sideOnePlayerTwo: Player | null;
  sideTwoPlayerOne: Player;
  sideTwoPlayerTwo: Player | null;
  activePlayerId: string | null;
  teamOneScore: number;
  teamTwoScore: number;
  streamType?: StreamType;
  streamData?: StreamData;
  matchStatus: 'LIVE' | 'COMPLETED';
  sets: Set[];
  overlayType?: 'SOURCE' | 'DESTINATION';
  showPlayerMatchHistory?: boolean;
  venueNo: number,
  clubName: string,
  noOfFrames: number | null,
  actualStartTimeDate: string,
}

const useStreaming = (venueId?: string, matchId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingData, setStreamingData] = useState<StreamingState | null>(null);
  const getLiveMatchHook = useGetMatchLiveData();
  const getMarkerLiveMatchesByVenueHookData = useMarkerGetLiveMatchByVenue();
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);

  const connectToMqtt = (topics: string[]) => {
    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    mqttClientRef.current = mqtt.connect(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 2000,
    });

    mqttClientRef.current.on('connect', () => {
      console.log('Connected to MQTT broker');
      topics.forEach((topic) => {
        mqttClientRef.current?.subscribe(topic, (err) => {
          if (err) console.error(`Subscription error for topic ${topic}: ${err.message}`);
          else console.log(`Subscribed to topic ${topic}`);
        });
      });
    });

    mqttClientRef.current.on('message', (topic, message) => {
      handleNewMessage(topic, message.toString());
    });

    mqttClientRef.current.on('error', (err) => {
      console.error('MQTT Error:', err);
      mqttClientRef.current?.end();
    });

    mqttClientRef.current.on('close', () => {
      console.log('Disconnected from MQTT broker');
    });
  };

  useEffect(() => {
    if (matchId) {
      fetchMatchData(matchId);
    } else if (venueId) {
      fetchActiveMatchForVenue(venueId);
      const topics = [`${venueId}/send-data`, `${venueId}/match-start`, `${venueId}/match-end`];
      connectToMqtt(topics);
    }

    return () => {
      mqttClientRef.current?.end();
    };
  }, [venueId, matchId]);

  const fetchMatchData = async (matchId: string) => {
    setLoading(true);
    try {
      const res = await getLiveMatchHook.getLiveMatchData({ matchId });

      if (res) {
        setStreamingData(null);
        setStreamingData({
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
          streamType: res.streamType,
          streamData: res.streamData,
          venueNo: res.venue.no,
          clubName: res.club.name,
          noOfFrames: res.noOfSets,
          actualStartTimeDate: res.actualStartTimeDate,
          overlayType: res.overlayType
        });

        if (res.matchStatus === 'LIVE' && !venueId) {
          const venueTopics = [`${res.venueId}/send-data`, `${res.venueId}/match-end`];
          connectToMqtt(venueTopics);
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
  };

  const fetchActiveMatchForVenue = async (venueId: string) => {
    setLoading(true);
    try {
      const res = await getMarkerLiveMatchesByVenueHookData.getMarkerLiveMatchesByVenue(venueId);
      if (res && res.matchId) {
        fetchMatchData(res.matchId);
      } else {
        setStreamingData(null);
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
  };

  const handleNewMessage = (topic: string, message: string) => {
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
        fetchActiveMatchForVenue(venueId!);
        break;
      case 'match-end':
        setStreamingData(null);
        break;
    }
  };

  return {
    loading,
    streamingData,
  };
};

export default useStreaming;