import * as React from "react";

export interface YearSelectProps {
    electionYears: string[];
    year: string;
    onYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class YearSelect extends React.Component<YearSelectProps> {
    render() {
        return (
            <div className="field">
                <label className="label" htmlFor="year_select">
                    Valgt år
                </label>
                <div className="control">
                    <div className="select is-dark is-fullwidth">
                        <select
                            title="Velg år"
                            id="year_select"
                            value={this.props.year}
                            onChange={this.props.onYearChange}
                            name="year"
                        >
                            {this.props.electionYears.map((item, index) => {
                                return (
                                    <option
                                        key={index} // By convention all children should have a unique key prop
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
