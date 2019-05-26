import * as React from "react";

export interface SaveComparisonButtonProps {
    saveComparison: () => void;
}

export class SaveComparisonButton extends React.Component<SaveComparisonButtonProps> {
    render() {
        return (
            <button
                className="button is-primary is-fullwidth"
                title={"Lagre sammenlikning"}
                id="saveComparison"
                onClick={this.props.saveComparison}
                type="button"
            >
                Lagre
            </button>
        );
    }
}
