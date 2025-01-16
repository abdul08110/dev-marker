export function BowringArena() {
  return (
    <section className="w-screen h-screen grid grid-cols-2 grid-rows-2 gap-4 p-4 relative">
      {/* Vertical pixel ruler */}
      <div className="absolute left-0 top-0 h-full w-6 bg-black/10 flex flex-col text-xs text-white">
        {[...Array(Math.floor(window.innerHeight / 100))].map((_, i) => (
          <div key={i} className="h-[100px] border-t border-black/20 text-center pt-1">
            {i * 100}
          </div>
        ))}
      </div>

      {/* Horizontal pixel ruler */}
      <div className="absolute left-0 top-0 w-full h-6 bg-black/10 flex text-xs text-white">
        {[...Array(Math.floor(window.innerWidth / 100))].map((_, i) => (
          <div key={i} className="w-[100px] border-l border-black/20 text-center pt-1">
            {i * 100}
          </div>
        ))}
      </div>

      {/* Existing iframes */}
      <iframe className="w-full h-full col-span-1" src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cc" />
      <iframe className="w-full h-full col-span-1" src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cd" />
      <iframe className="w-full h-full col-span-1" src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3374a37b1a19f749f4" />
      <iframe className="w-full h-full col-span-1" src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3274a37b1a19f749ec" />
    </section>
  );
}
