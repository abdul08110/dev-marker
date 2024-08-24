interface MarkerNavigationProps {
}

export function MarkerNavigation(props: MarkerNavigationProps) {
    return (
        <div className="w-full container py-5">
           <nav className="bg-black rounded-lg p-2 grid grid-cols-3">
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>
            &nbsp;
           </nav>
        </div>
    )
}