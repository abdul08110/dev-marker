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
  isSinglesEvent?: boolean;
}

export function TournamentConfirmationModal(props: TournamentConfirmationModalProps) {
  if (!props.format) return null;
  
  // For singles events, we don't need team objects
  if (props.isSinglesEvent) {
    if (!props.teamOnePlayers?.length || !props.teamTwoPlayers?.length) return null;
  } else {
    // For teams events, we need team objects
    if (!props.teamOne || !props.teamTwo) return null;
  }

  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center overflow-auto">
        <DialogTitle></DialogTitle>
        <div className="container max-h-screen py-8">
          <div className="flex justify-center">
            <div className="w-full bg-[#1F1F1F] p-6 rounded-lg shadow-xl max-w-2xl">
              <h2 className="text-white text-base font-bold text-center mb-6">
                {props.format.name} #Game - {props.format.matchNo}
              </h2>

              {/* Teams/Players Section */}
              <div className="flex justify-between items-center mb-8">
                {props.isSinglesEvent ? (
                  // Singles event - show individual players
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={props.teamOnePlayers[0]?.profilePhoto || '/images/user-dummy-pic.png'}
                        alt={props.teamOnePlayers[0]?.name || 'Player One'}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-bold text-center">
                        {props.teamOnePlayers[0]?.name || 'Player One'}
                      </span>
                    </div>

                    <span className="text-white/50 text-2xl">vs</span>

                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={props.teamTwoPlayers[0]?.profilePhoto || '/images/user-dummy-pic.png'}
                        alt={props.teamTwoPlayers[0]?.name || 'Player Two'}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-bold text-center">
                        {props.teamTwoPlayers[0]?.name || 'Player Two'}
                      </span>
                    </div>
                  </>
                ) : (
                  // Teams event - show team logos and names
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={props.teamOne?.logo}
                        alt={props.teamOne?.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-bold text-center">{props.teamOne?.name}</span>
                    </div>

                    <span className="text-white/50 text-2xl">vs</span>

                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={props.teamTwo?.logo}
                        alt={props.teamTwo?.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <span className="text-white text-base font-bold text-center">{props.teamTwo?.name}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Players Section */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-white/70 mb-3 text-xs text-center">
                    {props.isSinglesEvent ? 'Player One' : 'Team One Players'}
                  </h3>
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
                  <h3 className="text-white/70 mb-3 text-xs text-center">
                    {props.isSinglesEvent ? 'Player Two' : 'Team Two Players'}
                  </h3>
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
