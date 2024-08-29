interface TextHeaderProps {
    name: string,
}

export function TextHeader(props: TextHeaderProps) {
    return (
        <div className="w-full bg-black">
            <div className="container text-white py-8 text-center">
                <h5 className="text-xl">{props.name}</h5>
            </div>
        </div>
    )
}