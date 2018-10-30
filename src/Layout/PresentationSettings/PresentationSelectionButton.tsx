﻿import { ButtonProps, Button } from "../Button";
import * as React from "react";
import { PresentationType } from "../Types/PresentationType";

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