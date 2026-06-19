import QRCode from 'react-qr-code';
import { QrFlowPlayer, QrFlowState } from '@/hooks/useScoreboard';
import { ClubData } from '@/stores/types';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ProfileCard } from '@/components/ProfileCard';
import { CSSProperties } from 'react';
import { useFluidPx } from '@/hooks/useFluidPx';
import { ScoreBoardState } from '@/hooks/useScoreboard';

interface Props {
  qrFlowState: QrFlowState;
  activeClub: ClubData | null;
}

const glassStyle: CSSProperties = {
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: `
  inset 1px 0 0 rgba(255,255,255,0.2),
  inset -1px 0 0 rgba(255,255,255,0.2),
   inset 0 0.4px 0 rgba(255,255,255,0.2),
    inset 0 -0.5px 0 rgba(255,255,255,0.2)
`,
};

// Singles corner-bracket QR  (h-12 / offset-6 brackets, size 300)
function SinglesQr({ value }: { value: string }) {
  return (
    <div className="w-[min(35vh,35vw)] flex justify-center items-center relative grow">
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute left-0 top-0" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute left-[min(2.25vh,2.25vw)] -top-[min(2.25vh,2.25vw)] rotate-90" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute left-0 bottom-0" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute left-[min(2.25vh,2.25vw)] -bottom-[min(2.25vh,2.25vw)] rotate-90" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute top-0 right-0" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute -top-[min(2.25vh,2.25vw)] right-[min(2.25vh,2.25vw)] rotate-90" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute bottom-0 right-0" />
      <div className="h-[min(4.5vh,4.5vw)] bg-white w-px absolute -bottom-[min(2.25vh,2.25vw)] right-[min(2.25vh,2.25vw)] rotate-90" />
      <QRCode
        bgColor="transparent"
        value={value}
        size={300}
        fgColor="white"
        className="p-[min(4vh,4vw)] h-auto max-w-full w-full"
      />
    </div>
  );
}

// Doubles corner-bracket QR  (h-8 / offset-4 brackets, size 300)
function DoublesQr({ value }: { value: string }) {
  return (
    <div className="w-[min(45vh,45vw)] flex justify-center items-center relative">
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute left-0 top-0" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute left-[min(2vh,2vw)] -top-[min(2vh,2vw)] rotate-90" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute left-0 bottom-0" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute left-[min(2vh,2vw)] -bottom-[min(2vh,2vw)] rotate-90" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute top-0 right-0" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute -top-[min(2vh,2vw)] right-[min(2vh,2vw)] rotate-90" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute bottom-0 right-0" />
      <div className="h-[min(4vh,4vw)] bg-white w-px absolute -bottom-[min(2vh,2vw)] right-[min(2vh,2vw)] rotate-90" />
      <QRCode
        bgColor="transparent"
        value={value}
        size={400}
        fgColor="white"
        className="p-[min(2.5vh,2.5vw)] h-auto max-w-full w-full"
      />
    </div>
  );
}

function PlayerRowSingles({
  player,
  profileSize,
  playerNumber,
}: {
  player: QrFlowPlayer | undefined;
  profileSize: number;
  playerNumber: number;
}) {
  return (
    <div className="relative p-[min(2.2vh,2.2vw)] flex items-center gap-[min(1.5vh,1.5vw)] h-fit grow backdrop-blur-lg ">
      <div className="absolute -inset-[1px] pointer-events-none" style={glassStyle} />
      <div className="shrink-0">
        <ProfileCard
          imageUrl={player?.profilePhoto ?? '/images/empty-user.svg'}
          size={profileSize}
          color={player ? undefined : 'white'}
        />
      </div>
      <p className="font-medium text-[min(3vh,3vw)] leading-[130%] uppercase text-score-text z-10">
        {player ? `${player.playerName} ${player.playerLastName}` : `Player ${playerNumber}`}
      </p>
    </div>
  );
}

function PlayerRowDoubles({
  player,
  profileSize,
  playerNumber,
}: {
  player: QrFlowPlayer | undefined;
  profileSize: number;
  playerNumber: number;
}) {
  return (
    <div className="relative px-[min(1.8vh,1.8vw)] py-[min(2.3vh,2.3vw)] flex items-center gap-[min(1.5vh,1.5vw)] backdrop-blur-lg">
      <div className="absolute -inset-[1px] pointer-events-none" style={glassStyle} />
      <div className="shrink-0">
        <ProfileCard
          imageUrl={player?.profilePhoto ?? '/images/empty-user.svg'}
          size={profileSize}
          color={player ? undefined : 'white'}
        />
      </div>
      <p className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text z-10">
        {player ? `${player.playerName} ${player.playerLastName}` : `Player ${playerNumber}`}
      </p>
    </div>
  );
}

export function ScoreboardQrDisplay({ qrFlowState, activeClub }: Props) {
  const { playerCount, players } = qrFlowState;
  const venueId = activeClub?.venueId ?? '';
  const filledCount = Object.keys(players).length;
  const isSingles = playerCount === 2;

  // Fluid pixel sizes for ProfileCard (mirrors min(Xvh, Xvw))
  const profileSizeSingles = useFluidPx(0.075); // ≈ 81px at 1080p
  const profileSizeDoubles = useFluidPx(0.065); // ≈ 59px at 1080p

  // QR value advances to the next unfilled slot as players scan
  const singlesQrValue = !players[1] ? `${venueId}_1` : `${venueId}_2`;
  const teamAQrValue = !players[1] ? `${venueId}_1` : `${venueId}_2`;
  const teamBQrValue = !players[3] ? `${venueId}_3` : `${venueId}_4`;

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center min-h-screen px-[min(4vh,4vw)] py-[min(2.6vh,2.6vw)] bg-no-repeat flex flex-col justify-between gap-[min(4vh,4vw)]">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(2vh,2vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(2vh,2vw)] py-[min(1.2vh,1.2vw)] w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-[min(5.5vh,5.5vw)]"
            fallback="/images/user-dummy-pic.png"
            src={activeClub?.clubLogo ?? ''}
          />
          <p className="text-score-text font-semibold text-[min(3vh,3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {activeClub?.clubName ?? ''}
          </p>
        </div>

        <ImageWithFallback
          className="justify-self-center w-[min(40vh,40vw)] h-auto"
          fallback="/images/logos/clubliv-logo.svg"
          src="/images/logos/clubliv-logo.svg"
        />

        <p className="text-score-text font-semibold text-[min(3vh,3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          {filledCount} / {playerCount} Players
        </p>
      </div>

      {/* Body */}
      {isSingles ? (
        <div className="flex-1 w-full flex items-center gap-[min(5.5vh,5.5vw)] py-[min(12vh,12vw)] px-[min(9vh,9vw)]">
          <PlayerRowSingles player={players[1]} profileSize={profileSizeSingles} playerNumber={1} />
          <SinglesQr value={singlesQrValue} />
          <PlayerRowSingles player={players[2]} profileSize={profileSizeSingles} playerNumber={2} />
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center gap-[min(7.5vh,7.5vw)] py-[min(8vh,8vw)]">
          {/* Team A QR */}
          <div className="space-y-[min(7.5vh,7.5vw)] text-center">
            <p className="font-medium text-[min(3vh,3vw)] leading-[130%] uppercase text-score-text">Team A</p>
            <DoublesQr value={teamAQrValue} />
          </div>

          {/* Player list — Team A top, Team B bottom */}
          <div className="w-full space-y-[min(3vh,3vw)] max-w-[min(45vh,45vw)]">
            <div className="space-y-[min(1.1vh,1.1vw)]">
              <PlayerRowDoubles player={players[1]} profileSize={profileSizeDoubles} playerNumber={1} />
              <PlayerRowDoubles player={players[2]} profileSize={profileSizeDoubles} playerNumber={2} />
            </div>
            <hr className="border-white" />
            <div className="space-y-[min(1.1vh,1.1vw)]">
              <PlayerRowDoubles player={players[3]} profileSize={profileSizeDoubles} playerNumber={3} />
              <PlayerRowDoubles player={players[4]} profileSize={profileSizeDoubles} playerNumber={4} />
            </div>
          </div>

          {/* Team B QR */}
          <div className="space-y-[min(7.5vh,7.5vw)] text-center">
            <p className="font-medium text-[min(3vh,3vw)] leading-[130%] uppercase text-score-text">Team B</p>
            <DoublesQr value={teamBQrValue} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[min(1.8vh,1.8vw)]">
        <p className="text-score-text font-semibold text-[min(3vh,3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-[min(1vh,1vw)]">
          {isSingles ? 'Singles' : 'Doubles'}
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat bg-contain relative h-[min(6vh,6vw)] w-[min(27vh,27vw)]">
          <div className="px-[min(1.5vh,1.5vw)] absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-[min(3vh,3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
              Table {activeClub?.venueNo}
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-[min(3vh,3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-[min(1vh,1vw)]">
          Scan to play
        </p>
      </div>
    </main>
  );
}
