import * as React from "react";

export interface ResetButtonProps {
    restoreToDefault: () => void;
}

export class ResetButton extends React.Component<ResetButtonProps> {
    render() {
        return (
            <div>
                <button className="button is-primary is-outlined is-fullwidth has-text-weight-bold " onClick={this.props.restoreToDefault} type="button">
                    Tilbakestill Innstillinger
                </button>
            </div>
        );
    }
}

// button is-primary has-background-grey-lighter is-outlined is-fullwidth 