interface TournamentHeaderProps {
  logo: string;
  name: string;
}

export function TournamentHeader({ logo, name }: TournamentHeaderProps) {
  return (
    <div className="bg-black p-4 flex items-center gap-4">
      <img src={logo} alt="Tournament Logo" className="h-16 w-16 object-contain" />
      <h1 className="text-white text-2xl font-bold">{name}</h1>
    </div>
  );
}
