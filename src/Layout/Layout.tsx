import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";
import { ConnectedNotificationDisplay, NotificationType } from "./Notifications";
import { ConnectedTutorial } from "./Tutorial";

export interface LayoutProps {
    dataLoaded: boolean;
    hamburgerExpanded: boolean;
    toggleHamburger: (toggled: boolean) => void;
    initializeState: () => any;
    clearState: () => void;
    showNotification: (type: NotificationType, text: string) => void;
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
        const notificationText = `Det oppstod en feil så Lavinia måtte tilbakestilles. Feilmeldingen var: ${error.message}`;
        this.props.showNotification(NotificationType.DANGER, notificationText);
    }

    public render() {
        const showLoading = this.props.dataLoaded ? "" : " is-active";
        const pageLoaderClass = "pageloader is-size-1" + showLoading;

        return (
            <React.Fragment>
                <ConnectedTutorial />
                <ConnectedNavigation />
                <ConnectedNotificationDisplay />
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
