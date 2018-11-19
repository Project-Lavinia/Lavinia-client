import * as React from "react";

export interface NoSeatsCheckboxProps {
    showPartiesWithoutSeats: boolean;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class NoSeatsCheckbox extends React.Component<NoSeatsCheckboxProps> {
    render() {
        return (
            <div className="form-group mb-3">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="no-seats-setting"
                        checked={this.props.showPartiesWithoutSeats}
                        onChange={this.props.toggleShowPartiesWithoutSeats}
                    />
                    <label className="form-check-label" htmlFor="no-seats-setting">
                        Vis partier uten mandater
                    </label>
                </div>
            </div>
        );
    }
}
