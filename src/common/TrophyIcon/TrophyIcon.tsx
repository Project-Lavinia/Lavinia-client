import * as React from "react";
import { TrophyIcon as HeroTrophyIcon } from "@heroicons/react/24/solid";

export class TrophyIcon extends React.Component<{}, {}> {
    render() {
        return <HeroTrophyIcon className="icon" style={{ verticalAlign: "middle" }} />;
    }
}
