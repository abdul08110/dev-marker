import { TournamentItem } from '@/stores/types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TeamPlayerSelector } from '@/components/ui/team-player-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { useAppDispatch } from '@/stores';
import { setStateTournament } from '@/stores/thunks/sportThunks';
import { useNavigate } from 'react-router-dom';

interface TournamentPlayerHandicapSelectorSheetProps {
  open: boolean;
  onClose: () => void;
  tournamentItem: TournamentItem | null;
  selectedTournamentSubItemId: string | null;
}

const createFormSchema = (numberOfPlayers: number) => {
  return z.object({
    teamOnePlayers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          phoneNumber: z.string(),
          profilePhoto: z.string().nullable().optional(),
        }),
      )
      .length(numberOfPlayers),
    teamTwoPlayers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          phoneNumber: z.string().optional(),
          profilePhoto: z.string().nullable().optional(),
        }),
      )
      .length(numberOfPlayers),
    teamOneHandicap: z.number().optional(),
    teamTwoHandicap: z.number().optional(),
  });
};

export function TournamentPlayerHandicapSelectorSheet({
  open,
  onClose,
  tournamentItem,
  selectedTournamentSubItemId,
}: TournamentPlayerHandicapSelectorSheetProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedSubItem = tournamentItem
    ? tournamentItem.tournamentSubItems.find((item) => item.id === selectedTournamentSubItemId)
    : null;

  const numberOfPlayersPerTeam = selectedSubItem ? (selectedSubItem.format.noOfPlayers === 4 ? 2 : 1) : 1;
  const hasHandicap = selectedSubItem ? selectedSubItem.format.isHandicapAllowed : false;

  const formSchema = createFormSchema(numberOfPlayersPerTeam);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamOnePlayers: Array(numberOfPlayersPerTeam).fill({
        id: '',
        name: '',
        phoneNumber: '',
        profilePhoto: null,
      }),
      teamTwoPlayers: Array(numberOfPlayersPerTeam).fill({
        id: '',
        name: '',
        phoneNumber: '',
        profilePhoto: null,
      }),
    },
  });

  // Add form watch
  const formValues = form.watch();
  useEffect(() => {
    console.log('Form values changed:', formValues);
  }, [formValues]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const allTeamOnePlayersSelected = values.teamOnePlayers.every((player) => player.id);
    const allTeamTwoPlayersSelected = values.teamTwoPlayers.every((player) => player.id);

    if (!allTeamOnePlayersSelected || !allTeamTwoPlayersSelected) {
      alert('Please select all players before starting the game');
      return;
    }

    await dispatch(setStateTournament({
        data: {
            teamOnePlayers: values.teamOnePlayers,
            teamTwoPlayers: values.teamTwoPlayers,
            teamOneHandicap: values.teamOneHandicap,
            teamTwoHandicap: values.teamTwoHandicap,
        },
        tournamentItem: tournamentItem!,
        tournamentSubItem: selectedSubItem!,
    }));


    if (selectedSubItem!.format.sport === 'SNOOKER') {
      navigate(`/app/snooker`);
    } else {
      navigate(`/app/billiards`);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DrawerContent className="border-0 h-full">
        <DrawerHeader className="text-left text-white">
          <DrawerTitle className="text-2xl">Select Players and Start Game</DrawerTitle>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-4">
            <div className="space-y-4">
              {Array(numberOfPlayersPerTeam)
                .fill(0)
                .map((_, index) => (
                  <div key={`team-one-${index}`} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`teamOnePlayers.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {`Team One Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                          </FormLabel>
                          <FormControl>
                            <TeamPlayerSelector
                              teamId={tournamentItem?.tournamentTeamOne.id || ''}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

              {Array(numberOfPlayersPerTeam)
                .fill(0)
                .map((_, index) => (
                  <div key={`team-two-${index}`} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`teamTwoPlayers.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {`Team Two Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                          </FormLabel>
                          <FormControl>
                            <TeamPlayerSelector
                              teamId={tournamentItem?.tournamentTeamTwo.id || ''}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

              {hasHandicap && (
                <>
                  <FormField
                    control={form.control}
                    name="teamOneHandicap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Team One Handicap</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="text-white"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamTwoHandicap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Team Two Handicap</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="text-white"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Button type="submit" className="w-full">
              Start Game
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
