import * as React from "react";

export interface PartySelectProps {
    selectParty: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    partyCodeList: string[];
    partyMap: _.Dictionary<string>;
    partySelected: string;
}

export class PartySelect extends React.Component<PartySelectProps> {
    render() {
        return (
            <div className="field">
                <div className="control">
                    <div className="select is-fullwidth is-primary is-medium">
                        <select
                            id="district"
                            onChange={this.props.selectParty}
                            value={this.props.partySelected}
                        >
                            {this.props.partyCodeList.map((partyCode, index) => {
                                return (
                                    <option key={index} value={partyCode}>
                                        {this.props.partyMap[partyCode]}
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
