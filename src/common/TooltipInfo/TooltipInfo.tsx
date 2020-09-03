import * as React from "react";
import { checkExhaustively } from "../../utilities";
import { toast } from "bulma-toast";

export enum TooltipDirection {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export interface TooltipInfoProps {
    text: string;
    url?: string;
    direction?: TooltipDirection;
}

function getClassName(direction: TooltipDirection): string {
    const base = "icon has-tooltip-multiline has-tooltip-arrow";

    switch (direction) {
        case TooltipDirection.TOP:
            return base;
        case TooltipDirection.BOTTOM:
            return base + " has-tooltip-bottom";
        case TooltipDirection.LEFT:
            return base + " has-tooltip-left";
        case TooltipDirection.RIGHT:
            return base + " has-tooltip-right";
        default:
            checkExhaustively(direction);
            toast({
                dismissible: true,
                duration: 5000,
                message: `En feil oppstod: TooltipInfo getClassName switch nådde umulig valg: ${direction}`,
                position: "top-left",
                type: "is-danger"
            });
            return base;
    }
}

export class TooltipInfo extends React.Component<TooltipInfoProps, {}> {
    render() {
        const finalDirection = this.props.direction || TooltipDirection.TOP;
        return (
            <span className={getClassName(finalDirection)} data-tooltip={this.props.text}>
                <a href={this.props.url} target="_blank" rel="noreferrer noopener">
                <i className="fas fa-info-circle has-text-primary" />
                </a>
            </span>
        );
    }
}


