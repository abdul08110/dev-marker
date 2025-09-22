import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import useTournamentSchedule, { MatchData } from '@/hooks/useTournamentSchedule';
import { TournamentHeader } from '@/components/tournament/tournametHeader';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TournamentPlayerSelector } from '@/components/tournament/tournament-player-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TournamentFormat, TournamentPhase, TournamentTeam, TournamentItem } from '@/stores/types';
import { TournamentConfirmationModal } from '@/components/tournament/tournamentConfirmationModal';
import useGetTournamentSubItem from '@/api/app/useCreateTournamentSubItem';
import { setStateTournament } from '@/stores/thunks/sportThunks';
import { ScoreUpdateLoadingModal } from '@/components/modals/scoreUpdateLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentItemCard } from '@/components/tournament/TournamentItemCard';
import { TournamentSubItemCard } from '@/components/tournament/TournamentSubItemCard';
import { ArrowLeft } from 'lucide-react';

// Create a dynamic form schema based on tournament type and number of players
const createFormSchema = (numberOfPlayers: number, isSinglesEvent: boolean) => {
  return z.object({
    phaseId: z.string(),
    formatId: z.string(),
    teamOneId: isSinglesEvent ? z.string().optional() : z.string(),
    teamTwoId: isSinglesEvent ? z.string().optional() : z.string(),
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

// Type for the form data
type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export function Tournament() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, schedule, tournament, tournamentLoading, scheduledMatchesLoading, groupedMatches } =
    useTournamentSchedule();
  const { getTournamentSubItem } = useGetTournamentSubItem();

  const [selectedPhase, setSelectedPhase] = useState<TournamentPhase | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TournamentFormat | null>(null);
  const [selectedTeamOne] = useState<TournamentTeam | null>(null);
  const [selectedTeamTwo] = useState<TournamentTeam | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  
  // Teams tournament state
  const [selectedTournamentItem, setSelectedTournamentItem] = useState<{
    tournamentItem: TournamentItem;
    tournamentPhase: TournamentPhase;
    matches: MatchData[];
  } | null>(null);
  const [showSubItems, setShowSubItems] = useState(false);

  // Determine tournament type - singles or teams
  const tournamentType = tournament?.eventFormat;
  const isSinglesEvent = tournamentType === 'SINGLES';

  // Get active phases
  const activePhases = schedule?.filter((phase) => phase.phaseStatus === 'ACTIVE') || [];

  // Auto-select phase if only one active phase is available
  useEffect(() => {
    if (activePhases.length === 1 && !selectedPhase) {
      const phase = activePhases[0];
      setSelectedPhase(phase);
      form.setValue('phaseId', phase.id);
    }
  }, [activePhases]);

  // Calculate number of players based on format and tournament type
  const numberOfPlayersPerTeam = selectedFormat ? (isSinglesEvent ? 1 : selectedFormat.noOfPlayers / 2) : 1;

  const hasHandicap = selectedFormat?.isHandicapAllowed || false;

  const formSchema = createFormSchema(numberOfPlayersPerTeam, isSinglesEvent);

  const form = useForm<FormData>({
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
      }),
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
      }),
    );
  };

  // // Handle team one selection
  // const handleTeamOneChange = (value: string) => {
  //   const team = teams?.find((t) => t.id === value);
  //   form.setValue('teamOneId', value);
  //   setSelectedTeamOne(team || null);

  //   if (isSinglesEvent) {
  //     // In singles, the player is automatically the team user
  //     form.setValue(
  //       'teamOnePlayers',
  //       team!.users.map((user) => ({
  //         id: user.id!,
  //         name: user.name!,
  //         phoneNumber: user.phoneNumber! || '',
  //         profilePhoto: user.profilePhoto!,
  //       })),
  //     );
  //   } else {
  //     // In teams, we need to select players
  //     resetTeamOnePlayers();
  //   }
  // };

  // // Handle team two selection
  // const handleTeamTwoChange = (value: string) => {
  //   const team = teams?.find((t) => t.id === value);
  //   form.setValue('teamTwoId', value);
  //   setSelectedTeamTwo(team || null);

  //   if (isSinglesEvent) {
  //     // In singles, the player is automatically the team user
  //     form.setValue(
  //       'teamTwoPlayers',
  //       team!.users.map((user) => ({
  //         id: user.id!,
  //         name: user.name!,
  //         phoneNumber: user.phoneNumber! || '',
  //         profilePhoto: user.profilePhoto!,
  //       })),
  //     );
  //   } else {
  //     // In teams, we need to select players
  //     resetTeamTwoPlayers();
  //   }
  // };

  // Handle form submission
  const handleSubmit = async (values: FormData) => {
    console.log(values);
    setShowConfirmation(true);
  };

  // Teams tournament handlers
  const handleTournamentItemClick = (tournamentItemId: string) => {
    if (groupedMatches && groupedMatches[tournamentItemId]) {
      setSelectedTournamentItem(groupedMatches[tournamentItemId]);
      setShowSubItems(true);
    }
  };

  const handleBackToTournamentItems = () => {
    setShowSubItems(false);
    setSelectedTournamentItem(null);
  };

  const handleStartMatch = async (subItem: MatchData) => {
    if (!selectedTournamentItem) return;

    setBannerLoading(true);
    
    try {
      await dispatch(
        setStateTournament({
          data: {
            teamOnePlayers: [
              ...(subItem.teamOnePlayerOne ? [{
                id: subItem.teamOnePlayerOne.id,
                name: subItem.teamOnePlayerOne.name,
                phoneNumber: subItem.teamOnePlayerOne.phoneNumber,
                profilePhoto: subItem.teamOnePlayerOne.profilePhoto,
              }] : []),
              ...(subItem.teamOnePlayerTwo ? [{
                id: subItem.teamOnePlayerTwo.id,
                name: subItem.teamOnePlayerTwo.name,
                phoneNumber: subItem.teamOnePlayerTwo.phoneNumber,
                profilePhoto: subItem.teamOnePlayerTwo.profilePhoto,
              }] : []),
            ],
            teamTwoPlayers: [
              ...(subItem.teamTwoPlayerOne ? [{
                id: subItem.teamTwoPlayerOne.id,
                name: subItem.teamTwoPlayerOne.name,
                phoneNumber: subItem.teamTwoPlayerOne.phoneNumber,
                profilePhoto: subItem.teamTwoPlayerOne.profilePhoto,
              }] : []),
              ...(subItem.teamTwoPlayerTwo ? [{
                id: subItem.teamTwoPlayerTwo.id,
                name: subItem.teamTwoPlayerTwo.name,
                phoneNumber: subItem.teamTwoPlayerTwo.phoneNumber,
                profilePhoto: subItem.teamTwoPlayerTwo.profilePhoto,
              }] : []),
            ],
            teamOneHandicap: subItem.teamOneHandicap || 0,
            teamTwoHandicap: subItem.teamTwoHandicap || 0,
            format: subItem.gameFormat,
            tournamentSubItemId: subItem.id,
            tournamentId: tournament?.id || '',
            tournamentTeamOneId: subItem.tournamentTeamOne.id,
            tournamentTeamTwoId: subItem.tournamentTeamTwo.id,
            visibility: tournament?.tournamentVisibility || 'PUBLIC',
          },
        }),
      );

      navigate(`/app/${subItem.gameFormat.sport === 'SNOOKER' ? 'snooker' : 'billiards'}`);
    } catch (error) {
      console.error('Error starting match:', error);
    } finally {
      setBannerLoading(false);
    }
  };

  // Handle confirmation to start game
  const handleConfirmStart = async () => {
    const values = form.getValues();

    setBannerLoading(true);

    if (!isSinglesEvent && selectedTeamOne && selectedTeamTwo) {
      const data = await getTournamentSubItem(
        {
          formatId: selectedFormat!.id,
          tournamentPhaseId: selectedPhase!.id,
          teamOneId: selectedTeamOne.id,
          teamTwoId: selectedTeamTwo.id,
        },
        tournament?.id || '',
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
            tournamentId: tournament?.id || '',
            tournamentTeamOneId: selectedTeamOne.id,
            tournamentTeamTwoId: selectedTeamTwo.id,
            visibility: tournament?.tournamentVisibility || 'PUBLIC',
          },
        }),
      );
    } else {
      await dispatch(
        setStateTournament({
          data: {
            teamOnePlayers: values.teamOnePlayers,
            teamTwoPlayers: values.teamTwoPlayers,
            teamOneHandicap: values.teamOneHandicap,
            teamTwoHandicap: values.teamTwoHandicap,
            format: selectedFormat!,
            tournamentSubItemId: null,
            tournamentId: tournament?.id || '',
            tournamentTeamOneId: null,
            tournamentTeamTwoId: null,
            visibility: tournament?.tournamentVisibility || 'PUBLIC',
          },
        }),
      );
    }

    navigate(`/app/${selectedFormat!.sport === 'SNOOKER' ? 'snooker' : 'billiards'}`);

    setBannerLoading(false);
  };

  if (loading || tournamentLoading || scheduledMatchesLoading) {
    return <SnookerMarkingLoading />;
  }

  // For teams tournaments, check if we have grouped matches
  if (!isSinglesEvent && (!groupedMatches || Object.keys(groupedMatches).length === 0)) {
    return <SnookerMarkingLoading />;
  }

  // For singles tournaments, check if we have schedule
  if (isSinglesEvent && (!schedule || schedule.length === 0)) {
    return <SnookerMarkingLoading />;
  }

  console.log(groupedMatches);

  return (
    <div className="h-screen w-screen flex flex-col">
      <TournamentHeader logo={tournament?.logo || ''} name={tournament?.name || ''} />

      <div className="container mx-auto p-4">
        {!isSinglesEvent ? (
          // Teams Tournament UI
          <div className="max-w-4xl mx-auto space-y-6">
            {!showSubItems ? (
              // Show tournament items
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Tournament Matches</h2>
                  <p className="text-slate-400">Select a match to view individual games</p>
                </div>
                <div className="grid gap-4">
                  {groupedMatches && Object.entries(groupedMatches).map(([tournamentItemId, itemData]) => (
                    <TournamentItemCard
                      key={tournamentItemId}
                      noOfGamesScheduled={itemData.matches.length}
                      teamOne={itemData.matches[0].tournamentTeamOne}
                      teamTwo={itemData.matches[0].tournamentTeamTwo}
                      phaseName={itemData.tournamentPhase.name}
                      onShowGamesAndLineup={() => handleTournamentItemClick(tournamentItemId)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Show sub items for selected tournament item
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={handleBackToTournamentItems}
                    className="text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Matches
                  </Button>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedTournamentItem?.matches[0].tournamentTeamOne.name} vs {selectedTournamentItem?.matches[0].tournamentTeamTwo.name}
                    </h2>
                    <p className="text-slate-400">Select a game to start the match</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                    {selectedTournamentItem?.matches.map((match) => {
                      // Get player names for both teams
                      const teamOnePlayers = [
                        ...(match.teamOnePlayerOne ? [match.teamOnePlayerOne.name] : []),
                        ...(match.teamOnePlayerTwo ? [match.teamOnePlayerTwo.name] : [])
                      ];
                      
                      const teamTwoPlayers = [
                        ...(match.teamTwoPlayerOne ? [match.teamTwoPlayerOne.name] : []),
                        ...(match.teamTwoPlayerTwo ? [match.teamTwoPlayerTwo.name] : [])
                      ];
                      
                      return (
                        <TournamentSubItemCard
                          key={match.id}
                          subItem={match}
                          format={match.gameFormat}
                          dateScheduled={match.dateScheduled}
                          teamOnePlayers={teamOnePlayers}
                          teamTwoPlayers={teamTwoPlayers}
                          teamOne={match.tournamentTeamOne}
                          teamTwo={match.tournamentTeamTwo}
                          onStartMatch={() => handleStartMatch(match)}
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Singles Tournament UI (existing form)
          <div>
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
                    <CardTitle className="text-white">{isSinglesEvent ? 'Side One' : 'Team One'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team One / Player One Selection */}

                    {/* Team One Players - shown for all events */}
                    {isSinglesEvent ? (
                      <div className="mt-4 space-y-4">
                        {Array(numberOfPlayersPerTeam)
                          .fill(0)
                          .map((_, index) => (
                            <FormField
                              key={`team-one-${index}`}
                              control={form.control}
                              name={`teamOnePlayers.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Player One</FormLabel>
                                  <FormControl>
                                    <TournamentPlayerSelector
                                      tournamentId={schedule![0].tournament.id}
                                      onPlayerSelect={(player) => {
                                        field.onChange({
                                          id: player.id!,
                                          name: player.name!,
                                          phoneNumber: player.phoneNumber! || '',
                                          profilePhoto: player.profilePhoto!,
                                        });
                                      }}
                                      disabledPlayerList={form
                                        .getValues('teamOnePlayers')
                                        .filter((p, i) => i !== index && p.id)
                                        .map((p) => p.id)}
                                      placeholder="Search player..."
                                      selectedPlayer={field.value}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                      </div>
                    ) : (
                      selectedTeamOne && (
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
                                      <TournamentPlayerSelector
                                        tournamentId={schedule![0].tournament.id}
                                        teamId={selectedTeamOne?.id}
                                        onPlayerSelect={(player) => {
                                          field.onChange({
                                            id: player.id!,
                                            name: player.name!,
                                            phoneNumber: player.phoneNumber! || '',
                                            profilePhoto: player.profilePhoto!,
                                          });
                                        }}
                                        disabledPlayerList={form
                                          .getValues('teamOnePlayers')
                                          .filter((p, i) => i !== index && p.id)
                                          .map((p) => p.id)}
                                        placeholder="Search player..."
                                        selectedPlayer={field.value}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                        </div>
                      )
                    )}

                    {/* Team One Handicap */}
                    {hasHandicap && (
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
                    <CardTitle className="text-white">{isSinglesEvent ? 'Side Two' : 'Team Two'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Two / Player Two Selection */}

                    {/* Team Two Players - shown for all events */}
                    {isSinglesEvent ? (
                      <div className="mt-4 space-y-4">
                        {Array(numberOfPlayersPerTeam)
                          .fill(0)
                          .map((_, index) => (
                            <FormField
                              key={`team-two-${index}`}
                              control={form.control}
                              name={`teamTwoPlayers.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Player Two</FormLabel>
                                  <FormControl>
                                    <TournamentPlayerSelector
                                      tournamentId={schedule![0].tournament.id}
                                      onPlayerSelect={(player) => {
                                        field.onChange({
                                          id: player.id!,
                                          name: player.name!,
                                          phoneNumber: player.phoneNumber! || '',
                                          profilePhoto: player.profilePhoto!,
                                        });
                                      }}
                                      disabledPlayerList={form
                                        .getValues('teamTwoPlayers')
                                        .filter((p, i) => i !== index && p.id)
                                        .map((p) => p.id)}
                                      placeholder="Search player..."
                                      selectedPlayer={field.value}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                      </div>
                    ) : (
                      selectedTeamTwo && (
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
                                      <TournamentPlayerSelector
                                        tournamentId={schedule![0].tournament.id}
                                        teamId={selectedTeamTwo?.id}
                                        onPlayerSelect={(player) => {
                                          field.onChange({
                                            id: player.id!,
                                            name: player.name!,
                                            phoneNumber: player.phoneNumber! || '',
                                            profilePhoto: player.profilePhoto!,
                                          });
                                        }}
                                        disabledPlayerList={form
                                          .getValues('teamTwoPlayers')
                                          .filter((p, i) => i !== index && p.id)
                                          .map((p) => p.id)}
                                        placeholder="Search player..."
                                        selectedPlayer={field.value}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                        </div>
                      )
                    )}

                    {/* Team Two Handicap */}
                    {hasHandicap && (
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
            {(() => {
              // Comprehensive validation logic
              const isFormValid = () => {
                // Basic required fields
                if (!selectedPhase || !selectedFormat) {
                  return false;
                }

                if (isSinglesEvent) {
                  // For singles: validate format, phase, and players for both sides
                  const teamOnePlayers = form.getValues('teamOnePlayers') || [];
                  const teamTwoPlayers = form.getValues('teamTwoPlayers') || [];

                  const teamOnePlayersValid = teamOnePlayers.every((player) => player && player.id && player.name);
                  const teamTwoPlayersValid = teamTwoPlayers.every((player) => player && player.id && player.name);

                  return teamOnePlayersValid && teamTwoPlayersValid;
                } else {
                  // For teams: validate format, phase, teams, and players for both teams
                  if (!selectedTeamOne || !selectedTeamTwo) {
                    return false;
                  }

                  const teamOnePlayers = form.getValues('teamOnePlayers') || [];
                  const teamTwoPlayers = form.getValues('teamTwoPlayers') || [];

                  const teamOnePlayersValid = teamOnePlayers.every((player) => player && player.id && player.name);
                  const teamTwoPlayersValid = teamTwoPlayers.every((player) => player && player.id && player.name);

                  return teamOnePlayersValid && teamTwoPlayersValid;
                }
              };

              const isValid = isFormValid();

              return (
                isValid && (
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
                )
              );
            })()}
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
              isSinglesEvent={isSinglesEvent}
            />
          </div>
        )}
        <ScoreUpdateLoadingModal isModalOpen={bannerLoading} />
      </div>
    </div>
  );
}
