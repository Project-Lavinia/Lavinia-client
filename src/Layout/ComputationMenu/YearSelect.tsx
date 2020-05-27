import * as React from "react";

export interface YearSelectProps {
    electionYears: string[];
    year: string;
    tooltip?: React.ReactNode;
    onYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class YearSelect extends React.Component<YearSelectProps> {
    render() {
        return (
            <div className="field">
                <label className="label" htmlFor="year_select">
                    Valgt år {this.props.tooltip}
                </label>
                <div className="control">
                    <div className="select is-primary is-fullwidth">
                        <select
                            title="Velg år"
                            id="year_select"
                            value={this.props.year}
                            onChange={this.props.onYearChange}
                            name="year"
                        >
                            {this.props.electionYears.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
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
