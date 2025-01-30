import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import useTournamentSchedule from '@/hooks/useTournamentSchedule';
import { TournamentHeader } from '@/components/tournament/tournametHeader';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TeamPlayerSelector } from '@/components/ui/team-player-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TournamentFormat, TournamentTeam } from '@/stores/types';
import { TournamentConfirmationModal } from '@/components/tournament/tournamentConfirmationModal';
import useGetTournamentSubItem from '@/api/app/useCreateTournamentSubItem';
import { setStateTournament } from '@/stores/thunks/sportThunks';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';

const createFormSchema = (numberOfPlayers: number) => {
  return z.object({
    formatId: z.string(),
    teamOneId: z.string(),
    teamTwoId: z.string(),
    teamOnePlayers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          phoneNumber: z.string(),
          profilePhoto: z.string().nullable(),
        }),
      )
      .length(numberOfPlayers),
    teamTwoPlayers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          phoneNumber: z.string(),
          profilePhoto: z.string().nullable(),
        }),
      )
      .length(numberOfPlayers),
    teamOneHandicap: z.number().optional(),
    teamTwoHandicap: z.number().optional(),
  });
};

export function Tournament() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, schedule, teamsLoading, teams } = useTournamentSchedule();
  const {
    getTournamentSubItem,
  } = useGetTournamentSubItem();

  const [selectedFormat, setSelectedFormat] = useState<TournamentFormat | null>(null);
  const [selectedTeamOne, setSelectedTeamOne] = useState<TournamentTeam | null>(null);
  const [selectedTeamTwo, setSelectedTeamTwo] = useState<TournamentTeam | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  const numberOfPlayersPerTeam = selectedFormat ? selectedFormat.noOfPlayers / 2 : 1;
  const hasHandicap = selectedFormat?.isHandicapAllowed || false;

  const formSchema = createFormSchema(numberOfPlayersPerTeam);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFormat || !selectedTeamOne || !selectedTeamTwo) {
      alert('Please select format and teams');
      return;
    }

    const allTeamOnePlayersSelected = values.teamOnePlayers.every((player) => player.id);
    const allTeamTwoPlayersSelected = values.teamTwoPlayers.every((player) => player.id);

    if (!allTeamOnePlayersSelected || !allTeamTwoPlayersSelected) {
      alert('Please select all players before starting the game');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmStart = async () => {
    const values = form.getValues();

    setBannerLoading(true);

    const data = await getTournamentSubItem(
      {
        formatId: selectedFormat!.id,
        tournamentPhaseId: schedule!.id,
        teamOneId: selectedTeamOne!.id,
        teamTwoId: selectedTeamTwo!.id,
      },
      schedule!.tournament.id,
    );

    await dispatch(
      setStateTournament({
        data: {
          teamOnePlayers: values.teamOnePlayers,
          teamTwoPlayers: values.teamTwoPlayers,
          teamOneHandicap: values.teamOneHandicap,
          teamTwoHandicap: values.teamTwoHandicap,
          format: selectedFormat!,
          tournamentSubItemId: data!.id,
          tournamentId: schedule!.tournament.id,
          tournamentTeamOneId: selectedTeamOne!.id,
          tournamentTeamTwoId: selectedTeamTwo!.id,
        },
      }),
    );

    navigate(`/app/${selectedFormat!.sport === 'SNOOKER' ? 'snooker' : 'billiards'}`);

    setBannerLoading(false);
  };

  if (loading || teamsLoading || !schedule || !teams) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <TournamentHeader logo={schedule!.tournament.logo} name={schedule!.tournament.name} />

      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Format Selection */}
            <FormField
              control={form.control}
              name="formatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Select Format</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedFormat(schedule.tournamentFormats!.find((f) => f.id === value)!);
                      setSelectedTeamOne(null);
                      setSelectedTeamTwo(null);
                      form.setValue('teamOneId', '');
                      form.setValue('teamTwoId', '');
                    }}
                    value={field.value ? field.value : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder="Select Format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schedule!.tournamentFormats.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.name} - Game{format.matchNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Team Selection */}
            {selectedFormat && (
              <>
                {/* Team One Selection */}
                <FormField
                  control={form.control}
                  name="teamOneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Select Team One</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const team = teams?.find((t) => t.id === value);
                          setSelectedTeamOne(team || null);
                          form.setValue(
                            'teamOnePlayers',
                            Array(numberOfPlayersPerTeam).fill({
                              id: '',
                              name: '',
                              phoneNumber: '',
                              profilePhoto: null,
                            }),
                          );
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Select Team One" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Team Two Selection */}
                <FormField
                  control={form.control}
                  name="teamTwoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Select Team Two</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const team = teams?.find((t) => t.id === value);
                          setSelectedTeamTwo(team || null);
                          form.setValue(
                            'teamTwoPlayers',
                            Array(numberOfPlayersPerTeam).fill({
                              id: '',
                              name: '',
                              phoneNumber: '',
                              profilePhoto: null,
                            }),
                          );
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Select Team Two" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id} disabled={field.value === selectedTeamOne?.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Player Selection for Team One */}
                {selectedTeamOne &&
                  Array(numberOfPlayersPerTeam)
                    .fill(0)
                    .map((_, index) => (
                      <FormField
                        key={`team-one-${index}`}
                        control={form.control}
                        name={`teamOnePlayers.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              {`Team One Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                            </FormLabel>
                            <FormControl>
                              <TeamPlayerSelector
                                teamId={selectedTeamOne.id}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}

                {/* Player Selection for Team Two */}
                {selectedTeamTwo &&
                  Array(numberOfPlayersPerTeam)
                    .fill(0)
                    .map((_, index) => (
                      <FormField
                        key={`team-two-${index}`}
                        control={form.control}
                        name={`teamTwoPlayers.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              {`Team Two Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                            </FormLabel>
                            <FormControl>
                              <TeamPlayerSelector
                                teamId={selectedTeamTwo.id}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}

                {/* Handicap Fields */}
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
              </>
            )}

            {selectedFormat && selectedTeamOne && selectedTeamTwo && (
              <Button type="submit" className="w-full">
                Start Game
              </Button>
            )}
          </form>
        </Form>

        <TournamentConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmStart}
          teamOne={selectedTeamOne}
          teamTwo={selectedTeamTwo}
          format={selectedFormat}
          teamOnePlayers={form.getValues('teamOnePlayers') || []}
          teamTwoPlayers={form.getValues('teamTwoPlayers') || []}
        />
        <ScoreUpdateLoadingModal isModalOpen={bannerLoading} />
      </div>
    </div>
  );
}
