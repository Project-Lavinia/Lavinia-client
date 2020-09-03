import * as React from "react";

export interface ComparisonCheckboxProps {
    hidden: boolean;
    showComparison: boolean;
    toggleComparison: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ComparisonCheckbox extends React.Component<ComparisonCheckboxProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="field">
                <input
                    type="checkbox"
                    id="comparison-checkbox"
                    name="comparison-checkbox"
                    className="switch"
                    checked={this.props.showComparison}
                    onChange={this.props.toggleComparison}
                />
                <label className="checkbox" htmlFor="comparison-checkbox">
                    Mandatendringer
                </label>
            </div>
        );
    }
}
