import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { ConnectedPresentationSettings } from "./PresentationMenu";
import { ConnectedNavigation } from "./Navigation/ConnectedNavigation";
import { ConnectedPresentationSelection } from "./PresentationMenu/PresentationSelection/ConnectedPresentationSelection";
import { ConnectedNotificationDisplay, NotificationType } from "./Notifications";

export interface LayoutProps {
    dataLoaded: boolean;
    initializeState: () => any;
    clearState: () => void;
    showNotification: (type: NotificationType, text: string) => void;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

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
                <ConnectedNavigation />
                <ConnectedNotificationDisplay />
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
