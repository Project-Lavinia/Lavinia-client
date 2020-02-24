import * as React from "react";
import { PresentationSelection } from "./PresentationSelection/PresentationSelection";
import { ConnectedPresentationSettings } from "./PresentationSettings/ConnectedPresentationSettings";

export class PresentationMenu extends React.PureComponent {
    public render() {
        return (
            <div>
                <PresentationSelection />
                <ConnectedPresentationSettings />
            </div>
        );
    }
}
