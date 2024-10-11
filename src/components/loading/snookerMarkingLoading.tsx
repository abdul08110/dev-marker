import { Skeleton } from "../ui/skeleton";

export function SnookerMarkingLoading() {
    return (
        <section className="h-screen w-screen">
            <div className="container flex flex-col h-full w-full py-10 gap-8">
                <div className="flex gap-5 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 flex-grow" />
                </div>
                <div className="flex flex-col gap-8 mt-auto">
                    <Skeleton className="w-full h-36" />
                    <Skeleton className="w-full h-36" />
                    <Skeleton className="w-full h-36" />
                </div>
            </div>
        </section>
    )

}