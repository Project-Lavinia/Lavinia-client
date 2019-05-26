import * as React from "react";

export interface ResetButtonProps {
    restoreToDefault: () => void;
}

export class ResetButton extends React.Component<ResetButtonProps> {
    render() {
        return (
            <div>
                <button className="button is-danger is-fullwidth" onClick={this.props.restoreToDefault} type="button">
                    Tilbakestill Innstillinger
                </button>
            </div>
        );
    }
}
