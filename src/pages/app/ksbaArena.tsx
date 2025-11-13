export function KsbaArena() {
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
        {/* KSBA Scoreboard Display - Tables 1,3,4,6 */}
      {/* Vertical pixel ruler */}
      {/* KSBA Table 1 */}
      <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=68710448d08c823fa4b8fa71"
        />
        {/* KSBA Table 2 */}
        {/* <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=68710449d08c823fa4b8fa74"
        /> */}
        {/* KSBA Table 3 */}
        <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=68710449d08c823fa4b8fa77"
        />
        {/* KSBA Table 4 */}
        <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=6871044ad08c823fa4b8fa7a"
        />
        {/* KSBA Table 5 */}
        {/* <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=6871044ad08c823fa4b8fa7d"
        /> */}
        {/* KSBA Table 6 */}
        <iframe
          className="w-full h-full col-span-1"
          src="https://dev-marker.clubliv.in/app/scoreboard-render?venueId=6871044bd08c823fa4b8fa80"
        />
      {/* Existing iframes */}
    </section>
  );
}