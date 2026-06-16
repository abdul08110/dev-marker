import QRCode from 'react-qr-code';
import { QrFlowPlayer, QrFlowState } from '@/hooks/useScoreboard';
import { ClubData } from '@/stores/types';
import ImageWithFallback from '@/components/ui/image-with-fallback';

interface Props {
  qrFlowState: QrFlowState;
  activeClub: ClubData | null;
}

interface SlotConfig {
  playerNumber: number;
  label: string;
}

function getSlots(playerCount: 2 | 4): SlotConfig[] {
  if (playerCount === 2) {
    return [
      { playerNumber: 1, label: 'Player 1' },
      { playerNumber: 2, label: 'Player 2' },
    ];
  }
  return [
    { playerNumber: 1, label: 'Player 1' },
    { playerNumber: 2, label: 'Player 2' },
    { playerNumber: 3, label: 'Player 1' },
    { playerNumber: 4, label: 'Player 2' },
  ];
}

function PlayerCard({ player }: { player: QrFlowPlayer }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <ImageWithFallback
        src={player.profilePhoto ?? ''}
        fallback="/images/user-dummy-pic.png"
        className="size-20 rounded-full object-cover border-2 border-green-400"
      />
      <p className="text-white font-semibold text-xl text-center leading-tight">
        {player.playerName} {player.playerLastName}
      </p>
      <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Joined
      </div>
    </div>
  );
}

function QrSlot({ slot, player, venueId }: { slot: SlotConfig; player: QrFlowPlayer | undefined; venueId: string }) {
  const qrValue = `${venueId}_${slot.playerNumber}`;

  console.log({ qrValue });

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-score-text text-lg font-semibold uppercase tracking-wide opacity-70">{slot.label}</p>
      <div className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[200px] min-w-[180px]">
        {player ? (
          <PlayerCard player={player} />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-xl">
              <QRCode value={qrValue} size={120} />
            </div>
            <p className="text-white/50 text-xs text-center">Scan to join</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ScoreboardQrDisplay({ qrFlowState, activeClub }: Props) {
  const { playerCount, players } = qrFlowState;
  const venueId = activeClub?.venueId ?? '';
  const slots = getSlots(playerCount);
  const filledCount = Object.keys(players).length;

  const isSingles = playerCount === 2;

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center min-h-screen px-10 py-7 bg-no-repeat flex flex-col justify-between gap-10">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-5 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-5 py-3 w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-14"
            fallback="/images/user-dummy-pic.png"
            src={activeClub?.clubLogo ?? ''}
          />
          <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {activeClub?.clubName ?? ''}
          </p>
        </div>

        <ImageWithFallback
          className="object-cover justify-self-center"
          width={300}
          height={86}
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />

        <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          {filledCount} / {playerCount} Players
        </p>
      </div>

      {/* QR / Player slots */}
      {isSingles ? (
        // Singles — side by side
        <div className="flex-1 flex items-center justify-center gap-16">
          {slots.map((slot) => (
            <QrSlot key={slot.playerNumber} slot={slot} player={players[slot.playerNumber]} venueId={venueId} />
          ))}
        </div>
      ) : (
        // Doubles — two teams
        <div className="flex-1 flex items-center justify-center gap-20">
          {/* Team A — players 1 & 2 */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-score-text font-bold text-2xl uppercase tracking-widest">Team A</p>
            <div className="flex flex-col gap-6">
              {slots.slice(0, 2).map((slot) => (
                <QrSlot key={slot.playerNumber} slot={slot} player={players[slot.playerNumber]} venueId={venueId} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-64 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          {/* Team B — players 3 & 4 */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-score-text font-bold text-2xl uppercase tracking-widest">Team B</p>
            <div className="flex flex-col gap-6">
              {slots.slice(2, 4).map((slot) => (
                <QrSlot key={slot.playerNumber} slot={slot} player={players[slot.playerNumber]} venueId={venueId} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[18px]">
        <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-2.5">
          {isSingles ? 'Singles' : 'Doubles'}
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat relative h-16 w-[289px]">
          <div className="px-4 absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
              Table {activeClub?.venueNo}
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
          Scan to Play
        </p>
      </div>
    </main>
  );
}
