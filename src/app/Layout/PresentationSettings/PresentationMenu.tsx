import * as React from "react";
import { PresentationSelection } from "./PresentationSelection";
import { default as PresentationSettings } from "./PresentationSettingsContainer";
import * as style from "./PresentationMenu.css";

export class PresentationMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className={style.menu}>
                <PresentationSelection />
                <PresentationSettings />
            </div>
        );
    }
}
