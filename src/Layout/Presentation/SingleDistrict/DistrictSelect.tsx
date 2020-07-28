import * as React from "react";
import { DistrictResult } from "../../../computation/computation-models";

export interface DistrictSelectProps {
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    districtResults: DistrictResult[];
    districtSelected: string;
}

export class DistrictSelect extends React.Component<DistrictSelectProps> {
    render() {
        return (
            <div className="field">
                <div className="control">
                    <div className="select is-fullwidth is-primary is-medium">
                        <select
                            id="district"
                            onChange={this.props.selectDistrict}
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
            </div>
        );
    }
}
