interface TeamScoreProps {
  hasTournamentCombo: boolean;
  tournamentTeamOneScore: number | null | undefined;
  tournamentTeamTwoScore: number | null | undefined;
  teamOneScore: number;
  teamTwoScore: number;
  teamScoreCenter: string | null;
}

export function TeamScore({
  hasTournamentCombo,
  tournamentTeamOneScore,
  tournamentTeamTwoScore,
  teamOneScore,
  teamTwoScore,
  teamScoreCenter,
}: TeamScoreProps) {
  if (hasTournamentCombo) {
    return (
      <div className="space-y-[min(1vh,1vw)] pt-[min(7vh,7vw)]">
        <p className="text-text-light font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center px-[min(2vw,2vh)]">
          Team Score
        </p>
        <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
          <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] bg-[#595959]/[0.20] text-box-trim h-full w-full text-center py-[min(1.5vh,1.5vw)]">
            {tournamentTeamOneScore}
          </p>

          <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] leading-[130%] uppercase border text-center [border-image-source:linear-gradient(90deg,#E3A9F2_0%,rgba(226,179,237,0.05)_55.91%,#E0BCE8_109.78%)] [border-image-slice:1] w-full bg-[#AB51C6] drop-shadow-[0px_4px_4px_0px_#00000040] text-box-trim h-full py-[min(1.5vh,1.5vw)]">
            {teamScoreCenter}
          </p>

          <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] text-center bg-[#595959]/[0.20] w-full h-full text-box-trim py-[min(1.5vh,1.5vw)]">
            {tournamentTeamTwoScore}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[min(1vh,1vw)] pt-[min(7vh,7vw)]">
      <p className="text-text-light font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center px-[min(2vw,2vh)]">
        Frame Score
      </p>
      <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] bg-[#595959]/[0.20] text-box-trim h-full w-full text-center py-[min(1.5vh,1.5vw)]">
          {teamOneScore}
        </p>

        {teamScoreCenter && (
          <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] leading-[130%] uppercase border text-center [border-image-source:linear-gradient(90deg,#E3A9F2_0%,rgba(226,179,237,0.05)_55.91%,#E0BCE8_109.78%)] [border-image-slice:1] w-full bg-[#AB51C6] drop-shadow-[0px_4px_4px_0px_#00000040] text-box-trim h-full py-[min(1.5vh,1.5vw)]">
            {teamScoreCenter}
          </p>
        )}
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] text-center bg-[#595959]/[0.20] w-full h-full text-box-trim py-[min(1.5vh,1.5vw)]">
          {teamTwoScore}
        </p>
      </div>
    </div>
  );
}

interface FrameScorePanelProps {
  teamOneScore: number;
  teamTwoScore: number;
  teamScoreCenter: string | null;
}

export function FrameScorePanel({ teamOneScore, teamTwoScore, teamScoreCenter }: FrameScorePanelProps) {
  return (
    <div className="space-y-[min(1vh,1vw)] pt-[min(3.2vh,3.2vw)]">
      <p className="text-text-light font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center px-[min(2vw,2vh)]">
        Frame Score
      </p>
      <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] bg-[#595959]/[0.20] text-box-trim h-full w-full text-center py-[min(1.5vh,1.5vw)]">
          {teamOneScore}
        </p>

        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] leading-[130%] uppercase border text-center [border-image-source:linear-gradient(90deg,#E3A9F2_0%,rgba(226,179,237,0.05)_55.91%,#E0BCE8_109.78%)] [border-image-slice:1] w-full bg-[#AB51C6] drop-shadow-[0px_4px_4px_0px_#00000040] text-box-trim h-full py-[min(1.5vh,1.5vw)]">
          {teamScoreCenter}
        </p>

        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] text-center bg-[#595959]/[0.20] w-full h-full text-box-trim py-[min(1.5vh,1.5vw)]">
          {teamTwoScore}
        </p>
      </div>
    </div>
  );
}
