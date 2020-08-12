import * as React from "react";

export interface ResetButtonProps {
    restoreToDefault: () => void;
    highlight: boolean;
}

export class ResetButton extends React.Component<ResetButtonProps> {
    render() {
        const highlightButton = this.props.highlight ? " is-primary is-outlined" : " is-static";
        return (
            <div>
                <button
                    className={"button is-fullwidth has-text-weight-bold" + highlightButton}
                    onClick={this.props.restoreToDefault}
                    type="button"
                >
                    Tilbakestill til historisk ordning
                </button>
            </div>
        );
    }
}
