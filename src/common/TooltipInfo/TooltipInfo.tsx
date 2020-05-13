import * as React from "react";

export interface TooltipInfoProps {
    text: string;
}

export class TooltipInfo extends React.Component<TooltipInfoProps, {}> {
    render() {
        return (
            <span className="icon has-text-info has-tooltip-multiline has-tooltip-arrow" data-tooltip={this.props.text}>
                {" "}
                <i className="fas fa-info-circle" />
            </span>
        );
    }
}
