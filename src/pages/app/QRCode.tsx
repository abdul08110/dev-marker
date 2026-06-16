import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import mqtt from 'mqtt';
import { RootState } from '@/stores';
import { setTeamPlayer } from '@/stores/slices/sportSlice';
import { Player } from '@/stores/types';
import useInitiateScoreboardEntry from '@/api/app/useInitiateScoreboardEntry';
import useCancelScoreboardEntry from '@/api/app/useCancelScoreboardEntry';
import ImageWithFallback from '@/components/ui/image-with-fallback';

interface MqttPlayer {
  playerNumber: number;
  playerId: string;
  playerName: string;
  playerLastName: string;
  profilePhoto: string | null;
}

// Maps playerNumber (1-4) to { teamIndex, playerIndex } in Redux state.
// 2-player: 1→team1/p0, 2→team2/p0
// 4-player: 1→team1/p0, 2→team1/p1, 3→team2/p0, 4→team2/p1
function playerSlot(playerNumber: number, playerCount: number): { teamIndex: number; playerIndex: number } {
  if (playerCount === 2) {
    return { teamIndex: playerNumber - 1, playerIndex: 0 };
  }
  if (playerNumber <= 2) {
    return { teamIndex: 0, playerIndex: playerNumber - 1 };
  }
  return { teamIndex: 1, playerIndex: playerNumber - 3 };
}

const WaitingForPlayers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const activeClub = useSelector((state: RootState) => state.club.activeClub);

  const sport = (searchParams.get('sport') ?? 'snooker') as 'snooker' | 'billiards';
  const playerCount = Number(searchParams.get('playerCount') ?? '2') as 2 | 4;

  const { initiateScoreboardEntry } = useInitiateScoreboardEntry();
  const { cancelScoreboardEntry, loading: cancelling } = useCancelScoreboardEntry();

  const [players, setPlayers] = useState<Map<number, MqttPlayer>>(new Map());
  const [initiated, setInitiated] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!activeClub) {
      navigate('/app/home');
      return;
    }

    initiateScoreboardEntry({ venueId: activeClub.venueId, playerCount }).then((ok) => {
      if (ok) setInitiated(true);
    });
  }, []);

  useEffect(() => {
    if (!activeClub || !initiated) return;

    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const topic = `${activeClub.venueId}/marker/add-player`;

    const client = mqtt.connect(brokerUrl, { keepalive: 60, reconnectPeriod: 2000 });

    client.on('connect', () => {
      client.subscribe(topic);
    });

    client.on('message', (_topic, message) => {
      try {
        const data: MqttPlayer = JSON.parse(message.toString());
        setPlayers((prev) => {
          const next = new Map(prev);
          next.set(data.playerNumber, data);
          return next;
        });
      } catch {
        // malformed message
      }
    });

    client.on('error', () => client.end());

    return () => {
      client.end();
    };
  }, [activeClub, initiated]);

  // Transition to scoring screen once all slots are filled
  useEffect(() => {
    if (players.size < playerCount || navigatedRef.current) return;

    navigatedRef.current = true;

    // Dispatch each player into Redux
    players.forEach((mqttPlayer, playerNumber) => {
      const { teamIndex, playerIndex } = playerSlot(playerNumber, playerCount);
      const player: Player = {
        name: `${mqttPlayer.playerName} ${mqttPlayer.playerLastName}`.trim(),
        id: mqttPlayer.playerId,
        profilePhoto: mqttPlayer.profilePhoto ?? null,
      };
      dispatch(setTeamPlayer({ teamIndex, playerIndex, player }));
    });

    const route = sport === 'billiards' ? '/app/billiards' : '/app/snooker';
    navigate(`${route}?playerCount=${playerCount}`);
  }, [players]);

  const handleCancel = async () => {
    if (!activeClub) return;
    await cancelScoreboardEntry({ venueId: activeClub.venueId });
    navigate('/app/home');
  };

  const slotLabels =
    playerCount === 4
      ? ['Team 1 — Player 1', 'Team 1 — Player 2', 'Team 2 — Player 1', 'Team 2 — Player 2']
      : ['Player 1', 'Player 2'];

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-[#1F1F1F] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeClub?.clubLogo && (
            <ImageWithFallback
              className="size-10 object-contain"
              src={activeClub.clubLogo}
              fallback="/images/user-dummy-pic.png"
            />
          )}
          <div>
            <p className="text-white font-semibold text-sm">{activeClub?.clubName ?? ''}</p>
            <p className="text-gray-400 text-xs">Table {activeClub?.venueNo}</p>
          </div>
        </div>
        <p className="text-white text-sm font-medium uppercase">{sport}</p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-white text-2xl font-bold">Waiting for Players</h1>
          <p className="text-gray-400 text-sm">
            Ask players to scan the QR code on the scoreboard
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {Array.from({ length: playerCount }, (_, i) => {
            const playerNumber = i + 1;
            const arrived = players.get(playerNumber);
            return (
              <div
                key={playerNumber}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  arrived ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex-shrink-0">
                  {arrived ? (
                    <ImageWithFallback
                      className="size-12 rounded-full object-cover"
                      src={arrived.profilePhoto ?? ''}
                      fallback="/images/user-dummy-pic.png"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{slotLabels[i]}</p>
                  {arrived ? (
                    <p className="text-white font-medium truncate">
                      {arrived.playerName} {arrived.playerLastName}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">Waiting…</p>
                  )}
                </div>
                {arrived && (
                  <div className="flex-shrink-0 size-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-gray-500 text-xs text-center">
          {players.size} of {playerCount} players joined
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-3 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          {cancelling ? 'Cancelling…' : 'Cancel'}
        </button>
      </div>
    </main>
  );
};

export default WaitingForPlayers;
