import * as React from "react";
import { ConnectedPresentation } from "./Presentation";
import { ConnectedComputationMenu } from "./ComputationMenu";
import { Navigation } from "./Navigation";
import { PresentationMenu } from "./PresentationMenu";

export interface LayoutProps {
    initializeState: () => any;
}

export class Layout extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

    public render() {
        return (
            <div className="container-fluid">
                <Navigation />
                <div className="row">
                    <div className="col-md-3">
                        <ConnectedComputationMenu />
                    </div>
                    <div className="col-md-6">
                        <ConnectedPresentation />
                    </div>
                    <div className="col-md-3">
                        <PresentationMenu />
                    </div>
                </div>
            </div>
        );
    }
}
