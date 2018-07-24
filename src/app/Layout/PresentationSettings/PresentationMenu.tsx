import * as React from "react";
import { PresentationSelection } from "./PresentationSelection";
import { default as PresentationSettings } from "./PresentationSettingsContainer";

export class PresentationMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="presentation-settings-container settings-menu">
                <PresentationSelection />
                <PresentationSettings />
            </div>
        );
    }
}
