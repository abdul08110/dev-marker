import { Button } from "../../ui/button";
import backIcon from '@/assets/back.svg';
import settingsIcon from '@/assets/settings.svg'

interface ScoringHeaderProps {
    onBackClick: () => void;
    onSettingsClick: () => void;
}

export function ScoringHeader(props: ScoringHeaderProps) {
    return (
        <div className="bg-black">
            <div className="flex justify-between container py-5">
                <Button onClick={props.onBackClick} className="flex gap-2 justify-center items-center">
                    <img src={backIcon} />
                    Back
                </Button>

                <Button onClick={props.onSettingsClick} className="flex gap-2 justify-center items-center">
                    <img src={settingsIcon} />
                    Settings
                </Button>
            </div>
        </div>
    )
}