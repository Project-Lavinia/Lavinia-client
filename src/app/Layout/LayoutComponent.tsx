import * as React from "react";
import { NavMenu } from "./NavigationMenu";
import { SettingsMenuContainer } from "./ComputationSettings";
import { PresentationContainer } from "./Presentation";
import { PresentationMenu } from "./PresentationSettings";

interface LayoutProps {
    initializeState: () => any;
    initializePresentationState: () => any;
}

export class LayoutComponent extends React.Component<LayoutProps, {}> {
    async componentWillMount() {
        await this.props.initializeState();
    }

    public render() {
        return <div className="container-fluid">
                   <NavMenu/>
                   <div className="row">
                       <div className="col-md-3">
                           <SettingsMenuContainer/>
                       </div>
                       <div className="col-md-6">
                           <PresentationContainer/>
                       </div>
                       <div className="col-md-3">
                           <PresentationMenu/>
                       </div>
                   </div>
               </div>;
    }
}