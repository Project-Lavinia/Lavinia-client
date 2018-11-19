import * as React from "react";
import { DistrictResult } from "../../../computation/computation-models";

export interface DistrictSelectProps {
    hidden: boolean;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    districtResults: DistrictResult[];
    districtSelected: string;
}

export class DistrictSelect extends React.Component<DistrictSelectProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="form-row align-items-center">
                <div className="col-sm-4 my-1">
                    <label className="col-form-label col-md-2" htmlFor="district">
                        Fylke
                    </label>
                </div>
                <div className="col-sm-8">
                    <select
                        id="district"
                        onChange={this.props.selectDistrict}
                        className="form-control"
                        value={this.props.districtSelected}
                    >
                        {this.props.districtResults.map((item, index) => {
                            return (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
