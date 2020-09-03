import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";
import { ConnectedTutorial } from "./Tutorial";
import { toast } from "bulma-toast";

export interface LayoutProps {
    dataLoaded: boolean;
    hamburgerExpanded: boolean;
    toggleHamburger: (toggled: boolean) => void;
    initializeState: () => any;
    clearState: () => void;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }
    closeHamburger = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.props.hamburgerExpanded) {
            this.props.toggleHamburger!(true);
        }
    };

    async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.props.clearState();
        localStorage.clear();
        await this.props.initializeState();
        toast({
            dismissible: true,
            duration: 5000,
            message: `Det oppstod en feil så Lavinia måtte tilbakestilles. Feilmeldingen var: ${error.message}`,
            position: "top-left",
            type: "is-danger"
        });
    }

    public render() {
        const showLoading = this.props.dataLoaded ? "" : " is-active";
        const pageLoaderClass = "pageloader is-size-1" + showLoading;

        return (
            <React.Fragment>
                <ConnectedTutorial />
                <ConnectedNavigation />
                <div className={pageLoaderClass} id={"page_loader"}>
                    <span className="title is-size-2">Laster inn Lavinia...</span>
                </div>
                <div className="columns is-desktop section fit-page" onClick={this.closeHamburger}>
                    <div className="column is-narrow">
                        <ConnectedComputationMenu />
                    </div>
                    <div className="column presentation">
                        <ConnectedPresentationSettings />
                        <ConnectedPresentationSelection />
                        <ConnectedPresentation />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
