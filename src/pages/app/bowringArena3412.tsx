export function BowringArena3412() {
  return (
    // <section className="w-screen h-screen  relative">
    //   {/* Vertical pixel ruler */}
    //   <div className="absolute inset-0 w-[1540px] h-[750px] bg-black/10 grid grid-cols-2 grid-rows-2 gap-4 p-4 cursor-none">
    //     <iframe
    //       className="w-full h-full col-span-1"
    //       src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cc"
    //     />
    //     <iframe
    //       className="w-full h-full col-span-1"
    //       src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cd"
    //     />
    //     <iframe
    //       className="w-full h-full col-span-1"
    //       src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3374a37b1a19f749f4"
    //     />
    //     <iframe
    //       className="w-full h-full col-span-1"
    //       src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3274a37b1a19f749ec"
    //     />
    //   </div>

    //   {/* Existing iframes */}
    // </section>

    <section className="w-screen h-screen  relative bg-black/10 grid grid-cols-2 grid-rows-2 gap-4 p-4 cursor-none">
      {/* Vertical pixel ruler */}
       <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3374a37b1a19f749f4"
        />
        <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=671b6f3274a37b1a19f749ec"
        />
      <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cc"
        />
        <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=670e06ef4d4f643222e8c7cd"
        />
       
      {/* Existing iframes */}
    </section>
  );
}
