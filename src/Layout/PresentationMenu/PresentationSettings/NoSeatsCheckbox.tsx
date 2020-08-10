import * as React from "react";

export interface NoSeatsCheckboxProps {
    hidden: boolean;
    showPartiesWithoutSeats: boolean;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class NoSeatsCheckbox extends React.Component<NoSeatsCheckboxProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="field">
                <input
                        type="checkbox"
                        className="switch"
                        id="no-seats-setting"
                        name="no-seats-setting"
                        checked={this.props.showPartiesWithoutSeats}
                        onChange={this.props.toggleShowPartiesWithoutSeats}
                    />
                <label className="checkbox" htmlFor="no-seats-setting">
                    Vis alle partier
                </label>
            </div>
        );
    }
}
