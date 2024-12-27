import React, { useEffect } from 'react';
import { TournamentTeam } from '@/stores/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface TeamSelectorProps {
  onChange: (teamId: string) => void;
  teams: TournamentTeam[] | null;
  value: string;
  disabledTeamList: string[];
}

export function TeamSelector(props: TeamSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [teams, setTeams] = React.useState<TournamentTeam[]>(props.teams || []);
  const [isDropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  useEffect(() => {
    setTeams(props.teams || []);
  }, [props.teams]);

  const handleSearchChange = (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    setDropdownVisible(query !== '');

    if (props.teams) {
      const filteredTeams = props.teams.filter((team) =>
        team.users[0].name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
      setTeams(filteredTeams);
    } else {
      setTeams([]);
    }

    setLoading(false);
  };

  const handleSelect = (teamId: string) => {
    const selectedTeam = teams.find((team) => team.id === teamId);
    if (selectedTeam) {
      setSearchQuery(selectedTeam.users[0].name);
      props.onChange(teamId);
      setDropdownVisible(false);
    }
  };

  return (
    <div className="h-full w-full relative">
      <Command shouldFilter={false} className="w-full mt-2 bg-transparent text-white">
        <CommandInput
          className="text-white w-full"
          placeholder="Search Team..."
          value={searchQuery ? searchQuery : ''}
          onValueChange={(query: string) => handleSearchChange(query ? query : '')}
        />

        <CommandList className="absolute w-full max-h-60 mt-14 bg-white text-black shadow-lg z-10">
          {loading && <CommandEmpty>Loading Teams...</CommandEmpty>}
          {!loading && teams.length === 0 && <CommandEmpty>No Team found.</CommandEmpty>}
          {isDropdownVisible && (
            <CommandGroup>
              {teams.map((team) =>
                team && !props.disabledTeamList.includes(team.id) ? (
                  <CommandItem key={team.id} value={team.id} onSelect={() => handleSelect(team.id)}>
                    <div className="flex gap-2 items-center">
                      <img
                        src={team.logo ? team.logo : '/images/user-dummy-pic.png'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <span className='data-[selected=true]:text-white'>{team.users[0].name}</span>
                      </div>
                    </div>
                  </CommandItem>
                ) : null,
              )}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
