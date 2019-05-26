import * as React from "react";

export interface NoSeatsCheckboxProps {
    showPartiesWithoutSeats: boolean;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class NoSeatsCheckbox extends React.Component<NoSeatsCheckboxProps> {
    render() {
        return (
            <div className="field">
                <label className="label" htmlFor="no-seats-setting">
                    <input
                        type="checkbox"
                        name="no-seats-setting"
                        checked={this.props.showPartiesWithoutSeats}
                        onChange={this.props.toggleShowPartiesWithoutSeats}
                    />
                    &nbsp;Vis partier uten mandater
                </label>
            </div>
        );
    }
}
