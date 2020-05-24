import * as React from "react";

export interface TooltipInfoProps {
    text: string;
    url?: string;
}

export class TooltipInfo extends React.Component<TooltipInfoProps, {}> {
    render() {
        return (
            <span className="icon has-tooltip-multiline has-tooltip-arrow" data-tooltip={this.props.text}>
                <a href={this.props.url} target="_blank">
                <i className="fas fa-info-circle" />
                </a>
            </span>
        );
    }
}

export class TooltipInfoRight extends React.Component<TooltipInfoProps, {}> {
    render() {
        return (
            <span className="icon has-tooltip-multiline has-tooltip-arrow has-tooltip-right" data-tooltip={this.props.text}>
                <a href={this.props.url} target="_blank">
                <i className="fas fa-info-circle" />
                </a>
            </span>
        );
    }
}
