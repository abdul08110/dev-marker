import QRCode from 'react-qr-code';
import { QrFlowPlayer, QrFlowState } from '@/hooks/useScoreboard';
import { ClubData } from '@/stores/types';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ProfileCard } from '@/components/ProfileCard';

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

  const photoUrl =
    'https://i2-prod.mirror.co.uk/article34787567.ece/ALTERNATES/s1200b/0_Stade-Brestois-29-v-Paris-Saint-Germain-UEFA-Champions-League-202425-League-Knockout-Play-off-Fir.jpg';

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
      <div className="flex justify-between items-center gap-5">
        <div className="space-y-20 text-center">
          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text">Team a</p>
          <div className="flex justify-center items-center relative">
            <div className="h-8 bg-white w-px absolute left-0 top-0"></div>
            <div className="h-8 bg-white w-px absolute left-4 -top-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute left-0 bottom-0"></div>
            <div className="h-8 bg-white w-px absolute left-4 -bottom-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute top-0 right-0"></div>
            <div className="h-8 bg-white w-px absolute -top-4 right-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute bottom-0 right-0"></div>
            <div className="h-8 bg-white w-px absolute -bottom-4 right-4 rotate-90"></div>

            <QRCode
              bgColor="transparent"
              value={'123'}
              size={500}
              fgColor="white"
              className="p-4 h-auto max-w-full w-full"
            />
          </div>
        </div>
        <div className="w-full space-y-8">
          <div className="space-y-3">
            <div className="relative p-4 flex items-center gap-4 h-fit">
              <div
                className="absolute -inset-[1px] pointer-events-none"
                style={{
                  backdropFilter: 'blur(0.5px)',
                  WebkitBackdropFilter: 'blur(0.5px)',
                  boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
                }}
              />
              <ProfileCard imageUrl={photoUrl} size={60} />

              <p className="font-medium text-xl leading-[130%] uppercase text-score-text z-10"> Player 1</p>
            </div>

            {/* Empty user: user is not scanned yet */}
            <div className="relative p-4 flex items-center gap-4 h-fit">
              <div
                className="absolute -inset-[1px] pointer-events-none"
                style={{
                  backdropFilter: 'blur(0.5px)',
                  WebkitBackdropFilter: 'blur(0.5px)',
                  boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
                }}
              />
              <ProfileCard imageUrl={'/images/empty-user.svg'} size={60} color="white" />

              <p className="font-medium text-xl leading-[130%] uppercase text-score-text z-10"> ----------------</p>
            </div>
          </div>
          <hr className="border-white" />

          <div className="space-y-3">
            <div className="relative p-4 flex items-center gap-4 h-fit">
              <div
                className="absolute -inset-[1px] pointer-events-none"
                style={{
                  backdropFilter: 'blur(0.5px)',
                  WebkitBackdropFilter: 'blur(0.5px)',
                  boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
                }}
              />
              <ProfileCard imageUrl={photoUrl} size={60} />

              <p className="font-medium text-xl leading-[130%] uppercase text-score-text z-10"> Player 1</p>
            </div>
            <div className="relative p-4 flex items-center gap-4 h-fit">
              <div
                className="absolute -inset-[1px] pointer-events-none"
                style={{
                  backdropFilter: 'blur(0.5px)',
                  WebkitBackdropFilter: 'blur(0.5px)',
                  boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
                }}
              />
              <ProfileCard imageUrl={photoUrl} size={60} />

              <p className="font-medium text-xl leading-[130%] uppercase text-score-text z-10"> Player 1</p>
            </div>
          </div>
        </div>
        <div className="space-y-20 text-center">
          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text">Team b</p>
          <div className="flex justify-center items-center relative">
            <div className="h-8 bg-white w-px absolute left-0 top-0"></div>
            <div className="h-8 bg-white w-px absolute left-4 -top-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute left-0 bottom-0"></div>
            <div className="h-8 bg-white w-px absolute left-4 -bottom-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute top-0 right-0"></div>
            <div className="h-8 bg-white w-px absolute -top-4 right-4 rotate-90"></div>
            <div className="h-8 bg-white w-px absolute bottom-0 right-0"></div>
            <div className="h-8 bg-white w-px absolute -bottom-4 right-4 rotate-90"></div>

            <QRCode
              bgColor="transparent"
              value={'123'}
              size={500}
              fgColor="white"
              className="p-4 h-auto max-w-full w-full"
            />
          </div>
        </div>
      </div>

      <div className=" w-full grid grid-cols-3 items-center gap-20">
        <div className="relative p-6 flex items-center gap-4 h-fit">
          <div
            className="absolute -inset-[1px] pointer-events-none"
            style={{
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
            }}
          />
          <ProfileCard imageUrl={photoUrl} size={80} />

          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text z-10"> Player 1</p>
        </div>
        <div className="flex justify-center items-center relative">
          <div className="h-12 bg-white w-px absolute left-0 top-0"></div>
          <div className="h-12 bg-white w-px absolute left-6 -top-6 rotate-90"></div>
          <div className="h-12 bg-white w-px absolute left-0 bottom-0"></div>
          <div className="h-12 bg-white w-px absolute left-6 -bottom-6 rotate-90"></div>
          <div className="h-12 bg-white w-px absolute top-0 right-0"></div>
          <div className="h-12 bg-white w-px absolute -top-6 right-6 rotate-90"></div>
          <div className="h-12 bg-white w-px absolute bottom-0 right-0"></div>
          <div className="h-12 bg-white w-px absolute -bottom-6 right-6 rotate-90"></div>

          <QRCode
            bgColor="transparent"
            value={'123'}
            size={300}
            fgColor="white"
            className="p-8 h-auto max-w-full w-full"
          />
        </div>
        <div className="relative p-6 flex items-center gap-4 h-fit">
          <div
            className="absolute -inset-[1px] pointer-events-none"
            style={{
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              boxShadow: `inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)
              `,
            }}
          />
          <ProfileCard imageUrl={photoUrl} size={80} color="white" />

          <p className="font-medium text-3xl leading-[130%] uppercase text-score-text z-10"> Player 1</p>
        </div>
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
