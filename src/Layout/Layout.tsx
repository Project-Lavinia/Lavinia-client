import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";

export interface LayoutProps {
    dataLoaded: boolean;
    initializeState: () => any;
    clearState: () => void;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

    async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.props.clearState();
        localStorage.clear();
        await this.props.initializeState();
        console.error(error.name);
        console.error(error.message);
    }

    public render() {
        const showLoading = this.props.dataLoaded ? "" : " is-active";
        const pageLoaderClass = "pageloader is-size-1" + showLoading;

        return (
            <React.Fragment>
                <ConnectedNavigation />
                <div className={pageLoaderClass} id={"page_loader"}>
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
