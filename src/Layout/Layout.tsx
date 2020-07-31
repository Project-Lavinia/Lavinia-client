import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";
import { ConnectedTutorial } from "./Tutorial";

export interface LayoutProps {
    dataLoaded: boolean;
    initializeState: () => any;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

    public render() {
        const showLoading = this.props.dataLoaded ? "" : " is-active";
        const pageLoaderClass = "pageloader is-size-1" + showLoading;

        return (
            <React.Fragment>
                <ConnectedTutorial />
                <ConnectedNavigation />
                <div className={pageLoaderClass}>
                    <span className="title is-size-2">Laster inn Lavinia...</span>
                </div>
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
