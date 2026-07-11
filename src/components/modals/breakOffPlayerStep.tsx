import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface BreakOffTeamOption {
  /** Already-resolved player photo URLs (with fallbacks applied by the caller). 1 for singles, 2 for doubles. */
  photos: string[];
  label: string;
}

interface BreakOffPlayerStepProps {
  teams: BreakOffTeamOption[];
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
  /** Label for the primary button — "Confirm" (snooker, single step) or "Next" (billiards, before ball step). */
  confirmLabel?: string;
  cancelLabel?: string;
  title?: string;
}

/**
 * Shared "Who is breaking off?" team/player selection step. Renders only the dialog *body*
 * (title + team grid + action row) so callers can drop it inside their own <Dialog>/<DialogContent>
 * — billiards nests it as the first step of a two-step (player → ball) flow.
 */
export function BreakOffPlayerStep({
  teams,
  selectedIdx,
  onSelect,
  onCancel,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  title = 'Who is breaking off?',
}: BreakOffPlayerStepProps) {
  return (
    <>
      <DialogTitle className="text-lg font-semibold text-white">{title}</DialogTitle>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {teams.map((team, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              selectedIdx === idx ? 'border-white bg-white/10' : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex gap-1 justify-center">
              {team.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className={`${team.photos.length > 1 ? 'h-14 w-14' : 'h-16 w-16'} rounded-full object-cover`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-center leading-tight">{team.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button className="flex-1" disabled={selectedIdx === null} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </>
  );
}
