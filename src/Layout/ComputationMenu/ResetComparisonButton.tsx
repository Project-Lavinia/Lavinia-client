import * as React from "react";

export interface ResetComparisonButtonProps {
    resetComparison: () => void;
}

export class ResetComparisonButton extends React.Component<ResetComparisonButtonProps> {
    render() {
        return (
            <button
                className="button is-danger is-fullwidth"
                title={"Gjenopprett sammenlikning"}
                id="resetComparison"
                onClick={this.props.resetComparison}
                type="button"
            >
                Gjenopprett
            </button>
        );
    }
}
