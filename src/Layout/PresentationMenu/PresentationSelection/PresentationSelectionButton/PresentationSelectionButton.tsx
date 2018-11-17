import { ButtonProps, Button } from "../../../../common";
import * as React from "react";
import { PresentationType } from "../../../Presentation/presentation-models";

export interface PresentationSelectionButtonProps extends ButtonProps {
    presentationSelected: PresentationType;
}

export class PresentationSelectionButton extends Button<PresentationSelectionButtonProps> {
    constructor(props: PresentationSelectionButtonProps) {
        super(props);
    }
    render() {
        return (
            <button title={this.props.accessibilityLabel} onClick={this.props.onPress} className={this.props.className}>
                {this.props.title}
            </button>
        );
    }
}
