import * as React from "react";
import { PresentationSelection } from "./PresentationSelection/PresentationSelection";
import { ConnectedPresentationSettings } from "./PresentationSettings/ConnectedPresentationSettings";
import * as style from "./PresentationMenu.css";

export class PresentationMenu extends React.PureComponent {
    public render() {
        return (
            <div className={style.menu}>
                <PresentationSelection />
                <ConnectedPresentationSettings />
            </div>
        );
    }
}
