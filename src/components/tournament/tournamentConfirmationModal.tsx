import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { TournamentFormat, TournamentTeam } from '@/stores/types';

interface TournamentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamOne: TournamentTeam | null;
  teamTwo: TournamentTeam | null;
  format: TournamentFormat | null;
  teamOnePlayers: Array<{
    id: string;
    name: string;
    phoneNumber: string;
    profilePhoto: string | null;
  }>;
  teamTwoPlayers: Array<{
    id: string;
    name: string;
    phoneNumber: string;
    profilePhoto: string | null;
  }>;
}

export function TournamentConfirmationModal(props: TournamentConfirmationModalProps) {
  if (!props.teamOne || !props.teamTwo || !props.format) return null;

  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="top-0 left-0 absolute h-full bg-black/60 w-full flex justify-center items-center">
        <DialogTitle></DialogTitle>
        <div className="container">
          <div className=" p-2 flex justify-center">
            <div className="w-full bg-[#1F1F1F] p-6 rounded-lg shadow-xl max-w-2xl">
              <h2 className="text-white text-base font-bold text-center mb-6">
                {props.format.name} #Game - {props.format.matchNo}
              </h2>

              {/* Teams Section */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={props.teamOne.logo}
                    alt={props.teamOne.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <span className="text-white text-base font-bold text-center">{props.teamOne.name}</span>
                </div>

                <span className="text-white/50 text-2xl">vs</span>

                <div className="flex flex-col items-center gap-2">
                  <img
                    src={props.teamTwo.logo}
                    alt={props.teamTwo.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <span className="text-white text-base font-bold text-center">{props.teamTwo.name}</span>
                </div>
              </div>

              {/* Players Section */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-white/70 mb-3 text-xs text-center">Team One Players</h3>
                  <div className="space-y-2">
                    {props.teamOnePlayers?.map((player) => (
                      player && (
                        <div key={player.id} className="flex items-center gap-2">
                          <img
                            src={player.profilePhoto || '/images/user-dummy-pic.png'}
                            alt={player.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-white text-xs">{player.name}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white/70 mb-3 text-xs text-center">Team Two Players</h3>
                  <div className="space-y-2">
                    {props.teamTwoPlayers?.map((player) => (
                      player && (
                        <div key={player.id} className="flex items-center gap-2">
                          <img
                            src={player.profilePhoto || '/images/user-dummy-pic.png'}
                            alt={player.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-white text-xs">{player.name}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button variant="secondary" onClick={props.onClose}>
                  Cancel
                </Button>
                <Button onClick={props.onConfirm}>Start Game</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
