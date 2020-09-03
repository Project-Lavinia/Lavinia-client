import * as React from "react";
import { VulnerableDistrictSeat } from "../../../utilities/district";
import { Dictionary } from "lodash";
import { PartyName } from "../../../common/PartyName";
import { numberFormat } from "../../../utilities/customNumberFormat";

export interface VulnerableDistrictSeatTextProps {
    mostVulnerable?: VulnerableDistrictSeat | undefined;
    partyMap: Dictionary<string>;
}

export class VulnerableDistrictSeatText extends React.Component<VulnerableDistrictSeatTextProps, {}> {
    render() {
        if (this.props.mostVulnerable) {
            const partyMap = this.props.partyMap;
            const winnerPartyCode = this.props.mostVulnerable.winner.partyCode;

            if (this.props.mostVulnerable.runnerUp) {
                const runnerUpPartyCode = this.props.mostVulnerable.runnerUp.partyCode;
                return (
                    <React.Fragment>
                        {" Det mest utsatte sistemandatet (relativt til kvotient) var i "}
                        {this.props.mostVulnerable.district}
                        {" og ble vunnet av "}
                        <PartyName name={winnerPartyCode} partyMap={partyMap} />
                        {". "}
                        <PartyName name={runnerUpPartyCode} partyMap={partyMap} />
                        {" ville trengt "}
                        {numberFormat(this.props.mostVulnerable.moreVotesToWin!)}
                        {" flere stemmer for å vinne det."}
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        {" Det mest utsatte sistemandatet (relativt til kvotient) var i "}
                        {this.props.mostVulnerable.district}
                        {" og ble vunnet av "}
                        <PartyName name={winnerPartyCode} partyMap={partyMap} />
                        {". "}
                    </React.Fragment>
                );
            }
        } else {
            return null;
        }
    }
}
