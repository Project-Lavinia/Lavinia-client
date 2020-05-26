import * as React from "react";
import { VulnerableDistrictSeat } from "../../../utilities/district";

export interface VulnerableDistrictSeatTextProps {
    mostVulnerable?: VulnerableDistrictSeat | undefined;
}

export class VulnerableDistrictSeatText extends React.Component<VulnerableDistrictSeatTextProps, {}> {
    render() {
        if (this.props.mostVulnerable) {
            return (
                <React.Fragment>
                    {" Det mest utsatte sistemandatet (relativt til kvotient) var i "}
                    {this.props.mostVulnerable.district}
                    {" og ble vunnet av "}
                    {this.props.mostVulnerable.winner.partyCode}
                    {". "}
                    {this.props.mostVulnerable.runnerUp.partyCode}
                    {" ville trengt "}
                    {this.props.mostVulnerable.moreVotesToWin.toFixed(0)}
                    {" flere stemmer for å vinne det."}
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}
