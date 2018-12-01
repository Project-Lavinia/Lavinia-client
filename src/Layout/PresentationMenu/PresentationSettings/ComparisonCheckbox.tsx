import * as React from "react";

export interface ComparisonCheckboxProps {
    hidden: boolean;
    showComparison: boolean;
    toggleComparison: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ComparisonCheckbox extends React.Component<ComparisonCheckboxProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="form-group mb-3">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="comparison-checkbox"
                        checked={this.props.showComparison}
                        onChange={this.props.toggleComparison}
                    />
                    <label className="form-check-label" htmlFor="comparison-checkbox">
                        Sammenlign
                    </label>
                </div>
            </div>
        );
    }
}
