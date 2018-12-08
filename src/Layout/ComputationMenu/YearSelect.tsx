import * as React from "react";

export interface YearSelectProps {
    electionYears: string[];
    year: string;
    onYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class YearSelect extends React.Component<YearSelectProps> {
    render() {
        return (
            <div className="form-group row">
                <label className="text-left col-sm-2 col-form-label" htmlFor="year_select">
                    År
                </label>
                <div className="col-sm-10">
                    <select
                        title="Velg algoritme"
                        id="year_select"
                        value={this.props.year}
                        onChange={this.props.onYearChange}
                        className="form-control"
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
        );
    }
}
