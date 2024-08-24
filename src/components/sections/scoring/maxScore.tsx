interface MaxScoreProps {
    numberAhead: number,
    numberOn: number
}

export function MaxScore(props: MaxScoreProps) {
    return (
        <div className="w-full container">
            <div className="bg-lightPrimary p-2 text-center text-white w-full">
                <small>{ props.numberAhead } Ahead., { props.numberOn } on</small>
            </div>
        </div>
    )
}