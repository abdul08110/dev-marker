import QRCode from 'react-qr-code';
import { QrFlowPlayer, QrFlowState } from '@/hooks/useScoreboard';
import { ClubData } from '@/stores/types';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ProfileCard } from '@/components/ProfileCard';
import { CSSProperties } from 'react';

interface Props {
  qrFlowState: QrFlowState;
  activeClub: ClubData | null;
}

const glassStyle: CSSProperties = {
  backdropFilter: 'blur(0.5px)',
  WebkitBackdropFilter: 'blur(0.5px)',
  boxShadow: 'inset 0 0 0.5px 0.5px rgba(255,255,255,0.2)',
};

function SinglesQr({ value }: { value: string }) {
  return (
    <div className="flex justify-center items-center relative">
      <div className="h-12 bg-white w-px absolute left-0 top-0" />
      <div className="h-12 bg-white w-px absolute left-6 -top-6 rotate-90" />
      <div className="h-12 bg-white w-px absolute left-0 bottom-0" />
      <div className="h-12 bg-white w-px absolute left-6 -bottom-6 rotate-90" />
      <div className="h-12 bg-white w-px absolute top-0 right-0" />
      <div className="h-12 bg-white w-px absolute -top-6 right-6 rotate-90" />
      <div className="h-12 bg-white w-px absolute bottom-0 right-0" />
      <div className="h-12 bg-white w-px absolute -bottom-6 right-6 rotate-90" />
      <QRCode bgColor="transparent" value={value} size={300} fgColor="white" className="p-8 h-auto max-w-full w-full" />
    </div>
  );
}

function DoublesQr({ value }: { value: string }) {
  return (
    <div className="flex justify-center items-center relative">
      <div className="h-8 bg-white w-px absolute left-0 top-0" />
      <div className="h-8 bg-white w-px absolute left-4 -top-4 rotate-90" />
      <div className="h-8 bg-white w-px absolute left-0 bottom-0" />
      <div className="h-8 bg-white w-px absolute left-4 -bottom-4 rotate-90" />
      <div className="h-8 bg-white w-px absolute top-0 right-0" />
      <div className="h-8 bg-white w-px absolute -top-4 right-4 rotate-90" />
      <div className="h-8 bg-white w-px absolute bottom-0 right-0" />
      <div className="h-8 bg-white w-px absolute -bottom-4 right-4 rotate-90" />
      <QRCode bgColor="transparent" value={value} size={300} fgColor="white" className="p-4 h-auto max-w-full w-full" />
    </div>
  );
}

function PlayerRowSingles({ player }: { player: QrFlowPlayer | undefined }) {
  return (
    <div className="relative p-6 flex items-center gap-4 h-fit">
      <div className="absolute -inset-[1px] pointer-events-none" style={glassStyle} />
      <ProfileCard
        imageUrl={player?.profilePhoto ?? '/images/empty-user.svg'}
        size={80}
        color={player ? undefined : 'white'}
      />
      <p className="font-medium text-3xl leading-[130%] uppercase text-score-text z-10">
        {player ? `${player.playerName} ${player.playerLastName}` : '----------------'}
      </p>
    </div>
  );
}

function PlayerRowDoubles({ player }: { player: QrFlowPlayer | undefined }) {
  return (
    <div className="relative p-4 flex items-center gap-4 h-fit">
      <div className="absolute -inset-[1px] pointer-events-none" style={glassStyle} />
      <ProfileCard
        imageUrl={player?.profilePhoto ?? '/images/empty-user.svg'}
        size={60}
        color={player ? undefined : 'white'}
      />
      <p className="font-medium text-xl leading-[130%] uppercase text-score-text z-10">
        {player ? `${player.playerName} ${player.playerLastName}` : '----------------'}
      </p>
    </div>
  );
}

export function ScoreboardQrDisplay({ qrFlowState, activeClub }: Props) {
  const { playerCount, players } = qrFlowState;
  const venueId = activeClub?.venueId ?? '';
  const filledCount = Object.keys(players).length;
  const isSingles = playerCount === 2;

  // QR value advances to the next unfilled slot as players scan
  const singlesQrValue = !players[1] ? `${venueId}_1` : `${venueId}_2`;
  const teamAQrValue = !players[1] ? `${venueId}_1` : `${venueId}_2`;
  const teamBQrValue = !players[3] ? `${venueId}_3` : `${venueId}_4`;

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen overflow-hidden px-10 py-7 bg-no-repeat flex flex-col justify-between gap-10">
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

      {/* Body */}
      {isSingles ? (
        <div className="flex-1 w-full grid grid-cols-3 items-center gap-20 py-14">
          <PlayerRowSingles player={players[1]} />
          <SinglesQr value={singlesQrValue} />
          <PlayerRowSingles player={players[2]} />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-20 py-14">
          {/* Team A QR */}
          <div className="space-y-20 text-center">
            <p className="font-medium text-3xl leading-[130%] uppercase text-score-text">Team A</p>
            <DoublesQr value={teamAQrValue} />
          </div>

          {/* Player list — Team A top, Team B bottom */}
          <div className="w-full space-y-8 max-w-96">
            <div className="space-y-3">
              <PlayerRowDoubles player={players[1]} />
              <PlayerRowDoubles player={players[2]} />
            </div>
            <hr className="border-white" />
            <div className="space-y-3">
              <PlayerRowDoubles player={players[3]} />
              <PlayerRowDoubles player={players[4]} />
            </div>
          </div>

          {/* Team B QR */}
          <div className="space-y-20 text-center">
            <p className="font-medium text-3xl leading-[130%] uppercase text-score-text">Team B</p>
            <DoublesQr value={teamBQrValue} />
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
