import * as React from "react";

export interface ButtonProps {
    title: string;
    onPress?: () => any;
    accessibilityLabel?: string;
    className?: string;
    type?: string;
}

export class Button<TP> extends React.Component<TP & ButtonProps, {}> {
    render() {
        return (
            <button
                title={this.props.accessibilityLabel}
                onClick={this.props.onPress}
                type={this.props.type}
                className={`btn${this.props.className ? " " + this.props.className : ""}`}
            >
                {this.props.title}
            </button>
        );
    }
}
