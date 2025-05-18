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
import { useEffect, useState } from 'react';
import { TournamentFormat, TournamentPhase, TournamentTeam } from '@/stores/types';
import { TournamentConfirmationModal } from '@/components/tournament/tournamentConfirmationModal';
import useGetTournamentSubItem from '@/api/app/useCreateTournamentSubItem';
import { setStateTournament } from '@/stores/thunks/sportThunks';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Create a dynamic form schema based on tournament type and number of players
const createFormSchema = (numberOfPlayers: number) => {
  return z.object({
    phaseId: z.string(),
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
  const { getTournamentSubItem } = useGetTournamentSubItem();

  const [selectedPhase, setSelectedPhase] = useState<TournamentPhase | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TournamentFormat | null>(null);
  const [selectedTeamOne, setSelectedTeamOne] = useState<TournamentTeam | null>(null);
  const [selectedTeamTwo, setSelectedTeamTwo] = useState<TournamentTeam | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  // Determine tournament type - singles or teams
  const tournamentType = schedule && schedule.length > 0 ? schedule[0].tournament.eventFormat : null;
  const isSinglesEvent = tournamentType === 'SINGLES';
  
  // Get active phases
  const activePhases = schedule?.filter(phase => phase.phaseStatus === 'ACTIVE') || [];

  // Auto-select phase if only one active phase is available
  useEffect(() => {
    if (activePhases.length === 1 && !selectedPhase) {
      const phase = activePhases[0];
      setSelectedPhase(phase);
      form.setValue('phaseId', phase.id);
    }
  }, [activePhases]);

  // Calculate number of players based on format and tournament type
  const numberOfPlayersPerTeam = selectedFormat ? 
    (isSinglesEvent ? 1 : selectedFormat.noOfPlayers / 2) : 1;
  
  const hasHandicap = selectedFormat?.isHandicapAllowed || false;

  const formSchema = createFormSchema(numberOfPlayersPerTeam);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formatId: '',
    },
  });

  // Handle format selection
  const handleFormatChange = (value: string) => {
    const format = selectedPhase!.tournamentFormats!.find((f) => f.id === value)!;
    setSelectedFormat(format);
    form.setValue('formatId', value);
    
    // Reset team player selections when format changes
    if (selectedTeamOne) {
      resetTeamOnePlayers();
    }
    
    if (selectedTeamTwo) {
      resetTeamTwoPlayers();
    }
  };

  // Handle phase selection
  const handlePhaseChange = (value: string) => {
    const phase = schedule?.find((f) => f.id === value)!;
    setSelectedFormat(null);
    setSelectedPhase(phase);
    form.setValue('phaseId', value);
  };

  // Reset team one players
  const resetTeamOnePlayers = () => {
    form.setValue(
      'teamOnePlayers',
      Array(numberOfPlayersPerTeam).fill({
        id: '',
        name: '',
        phoneNumber: '',
        profilePhoto: null,
      })
    );
  };

  // Reset team two players
  const resetTeamTwoPlayers = () => {
    form.setValue(
      'teamTwoPlayers',
      Array(numberOfPlayersPerTeam).fill({
        id: '',
        name: '',
        phoneNumber: '',
        profilePhoto: null,
      })
    );
  };

  // Handle team one selection
  const handleTeamOneChange = (value: string) => {
    const team = teams?.find((t) => t.id === value);
    form.setValue('teamOneId', value);
    setSelectedTeamOne(team || null);

    if (isSinglesEvent) {
      // In singles, the player is automatically the team user
      form.setValue(
        'teamOnePlayers',
        team!.users.map((user) => ({
          id: user.id!,
          name: user.name!,
          phoneNumber: user.phoneNumber! || '',
          profilePhoto: user.profilePhoto!,
        })),
      );
    } else {
      // In teams, we need to select players
      resetTeamOnePlayers();
    }
  };

  // Handle team two selection
  const handleTeamTwoChange = (value: string) => {
    const team = teams?.find((t) => t.id === value);
    form.setValue('teamTwoId', value);
    setSelectedTeamTwo(team || null);

    if (isSinglesEvent) {
      // In singles, the player is automatically the team user
      form.setValue(
        'teamTwoPlayers',
        team!.users.map((user) => ({
          id: user.id!,
          name: user.name!,
          phoneNumber: user.phoneNumber! || '',
          profilePhoto: user.profilePhoto!,
        })),
      );
    } else {
      // In teams, we need to select players
      resetTeamTwoPlayers();
    }
  };

  // Handle form submission
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

  // Handle confirmation to start game
  const handleConfirmStart = async () => {
    const values = form.getValues();

    setBannerLoading(true);

    const data = await getTournamentSubItem(
      {
        formatId: selectedFormat!.id,
        tournamentPhaseId: selectedPhase!.id,
        teamOneId: selectedTeamOne!.id,
        teamTwoId: selectedTeamTwo!.id,
      },
      schedule![0].tournament.id,
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
          tournamentId: schedule![0].tournament.id,
          tournamentTeamOneId: selectedTeamOne!.id,
          tournamentTeamTwoId: selectedTeamTwo!.id,
          visibility: schedule![0].tournament.tournamentVisibility || 'PUBLIC',
        },
      }),
    );

    navigate(`/app/${selectedFormat!.sport === 'SNOOKER' ? 'snooker' : 'billiards'}`);

    setBannerLoading(false);
  };

  if (loading || teamsLoading || !schedule || !teams || schedule.length === 0) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <TournamentHeader logo={schedule![0].tournament.logo} name={schedule![0].tournament.name} />

      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Tournament Phase Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="phaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Select Phase</FormLabel>
                      <Select onValueChange={handlePhaseChange} value={field.value ? field.value : ''}>
                        <FormControl>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Select Phase" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activePhases.map((phase) => (
                            <SelectItem key={phase.id} value={phase.id}>
                              {phase.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Game Format Selection */}
            {selectedPhase && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Game Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="formatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Select Format</FormLabel>
                        <Select onValueChange={handleFormatChange} value={field.value ? field.value : ''}>
                          <FormControl>
                            <SelectTrigger className="text-white">
                              <SelectValue placeholder="Select Format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedPhase!.tournamentFormats
                              .sort((a, b) => a.matchNo! - b.matchNo!)
                              .map((format) => (
                                <SelectItem key={format.id} value={format.id}>
                                  Game {format.matchNo} - {format.name} ({format.noOfPlayers} players)
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Teams/Players Selection */}
            {selectedFormat && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team One / Player One */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {isSinglesEvent ? 'Player One' : 'Team One'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="teamOneId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {isSinglesEvent ? 'Select Player One' : 'Select Team One'}
                          </FormLabel>
                          <Select onValueChange={handleTeamOneChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-white">
                                <SelectValue
                                  placeholder={
                                    isSinglesEvent ? 'Select Player One' : 'Select Team One'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {isSinglesEvent
                                    ? `${team.users[0]?.name || 'Unknown'} (${team.name})`
                                    : team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Team One Players - only shown for team events */}
                    {selectedTeamOne && !isSinglesEvent && (
                      <div className="mt-4 space-y-4">
                        <h3 className="text-lg font-medium text-white">Team One Players</h3>
                        {Array(numberOfPlayersPerTeam)
                          .fill(0)
                          .map((_, index) => (
                            <FormField
                              key={`team-one-${index}`}
                              control={form.control}
                              name={`teamOnePlayers.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    {`Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                                  </FormLabel>
                                  <FormControl>
                                    <TeamPlayerSelector
                                      teamId={selectedTeamOne.id}
                                      value={field.value}
                                      onChange={field.onChange}
                                      disabledPlayerIds={form
                                        .getValues('teamOnePlayers')
                                        .filter((p, i) => i !== index && p.id)
                                        .map(p => p.id)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                      </div>
                    )}

                    {/* Team One Handicap */}
                    {hasHandicap && selectedTeamOne && (
                      <FormField
                        control={form.control}
                        name="teamOneHandicap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              {isSinglesEvent ? 'Player One Handicap' : 'Team One Handicap'}
                            </FormLabel>
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
                    )}
                  </CardContent>
                </Card>

                {/* Team Two / Player Two */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {isSinglesEvent ? 'Player Two' : 'Team Two'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="teamTwoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {isSinglesEvent ? 'Select Player Two' : 'Select Team Two'}
                          </FormLabel>
                          <Select onValueChange={handleTeamTwoChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-white">
                                <SelectValue
                                  placeholder={
                                    isSinglesEvent ? 'Select Player Two' : 'Select Team Two'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {isSinglesEvent
                                    ? `${team.users[0]?.name || 'Unknown'} (${team.name})`
                                    : team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Team Two Players - only shown for team events */}
                    {selectedTeamTwo && !isSinglesEvent && (
                      <div className="mt-4 space-y-4">
                        <h3 className="text-lg font-medium text-white">Team Two Players</h3>
                        {Array(numberOfPlayersPerTeam)
                          .fill(0)
                          .map((_, index) => (
                            <FormField
                              key={`team-two-${index}`}
                              control={form.control}
                              name={`teamTwoPlayers.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    {`Player ${numberOfPlayersPerTeam > 1 ? index + 1 : ''}`}
                                  </FormLabel>
                                  <FormControl>
                                    <TeamPlayerSelector
                                      teamId={selectedTeamTwo.id}
                                      value={field.value}
                                      onChange={field.onChange}
                                      disabledPlayerIds={form
                                        .getValues('teamTwoPlayers')
                                        .filter((p, i) => i !== index && p.id)
                                        .map(p => p.id)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                      </div>
                    )}

                    {/* Team Two Handicap */}
                    {hasHandicap && selectedTeamTwo && (
                      <FormField
                        control={form.control}
                        name="teamTwoHandicap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              {isSinglesEvent ? 'Player Two Handicap' : 'Team Two Handicap'}
                            </FormLabel>
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
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form submission button */}
            {selectedFormat && selectedTeamOne && selectedTeamTwo && (
              <>
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="bg-red-500/10 border border-red-500 rounded-md p-3 mb-4">
                    <ul className="text-red-500 text-sm list-disc list-inside">
                      {Object.entries(form.formState.errors).map(([key, error]) => {
                        const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                        return <li key={key}>{`${fieldName} ${error?.message?.toString() || 'is required'}`}</li>;
                      })}
                    </ul>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Start Game
                </Button>
              </>
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
