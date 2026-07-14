import { useEffect } from 'react';
import mqtt from 'mqtt';
import { setTeamPlayer } from '@/stores/slices/sportSlice';
import { useAppDispatch } from '@/stores';
import { Player } from '@/stores/types';

function playerSlot(playerNumber: number, playerCount: number): { teamIndex: number; playerIndex: number } {
  if (playerCount === 2) {
    return { teamIndex: playerNumber - 1, playerIndex: 0 };
  }
  if (playerNumber <= 2) {
    return { teamIndex: 0, playerIndex: playerNumber - 1 };
  }
  return { teamIndex: 1, playerIndex: playerNumber - 3 };
}

export function useScoreboardPlayerSync(venueId: string, playerCount: 2 | 4, enabled: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || !venueId) return;

    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const client = mqtt.connect(brokerUrl, { keepalive: 60, reconnectPeriod: 2000 });
    const topic = `${venueId}/marker/add-player`;

    client.on('connect', () => client.subscribe(topic));
    client.on('message', (_topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const { teamIndex, playerIndex } = playerSlot(data.playerNumber, playerCount);
        const player: Player = {
          id: data.playerId,
          name: `${data.playerName} ${data?.playerLastName || ''}`.trim(),
          profilePhoto: data.profilePhoto ?? null,
        };
        dispatch(setTeamPlayer({ teamIndex, playerIndex, player }));
      } catch {}
    });
    client.on('error', () => client.end());

    return () => {
      client.end();
    };
  }, [venueId, playerCount, enabled]);
}
