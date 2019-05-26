import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";

export interface LayoutProps {
    initializeState: () => any;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

    public render() {
        return (
            <React.Fragment>
                <ConnectedNavigation />

                <div className="columns is-desktop section">
                    <div className="column is-narrow">
                        <ConnectedComputationMenu />
                    </div>
                    <div className="column">
                        <ConnectedPresentationSettings />
                        <ConnectedPresentationSelection />
                        <ConnectedPresentation />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
