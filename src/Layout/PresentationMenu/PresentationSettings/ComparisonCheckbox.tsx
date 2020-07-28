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
                <label className="checkbox" htmlFor="comparison-checkbox">
                    <input
                        type="checkbox"
                        name="comparison-checkbox"
                        checked={this.props.showComparison}
                        onChange={this.props.toggleComparison}
                    />
                    &nbsp;Mandatendringer
                </label>
            </div>
        );
    }
}
