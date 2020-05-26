import * as React from "react";
import { TooltipInfoProps } from "./TooltipInfo";

export class TooltipInfoRight extends React.Component<TooltipInfoProps, {}> {
    render() {
        return (
            <span className="icon has-tooltip-multiline has-tooltip-arrow has-tooltip-right" data-tooltip={this.props.text}>
                <a href={this.props.url} target="_blank" rel="noreferrer noopener">
                <i className="fas fa-info-circle" />
                </a>
            </span>
        );
    }
}