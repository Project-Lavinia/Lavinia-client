import * as React from "react";
import { VulnerableDistrictSeat, VulnerableVotes } from "../../../utilities/district";
import { PartyName } from "../../../common/PartyName";
import { numberFormat } from "../../../utilities/customNumberFormat";

interface InfoBoxProps {
    vulnerable: VulnerableDistrictSeat;
    vulnerableVotes: VulnerableVotes;
    partyMap: _.Dictionary<string>;
}

export class InfoBox extends React.Component<InfoBoxProps> {
    getExtendedInfo(vulnerable: VulnerableDistrictSeat, vulnerableVotes: VulnerableVotes, partyMap: _.Dictionary<string>) {
        if (vulnerable.runnerUp && vulnerableVotes.partyCode) {
            if (vulnerable.moreVotesToWin! > vulnerableVotes.moreVotesToWin!) {
                return <React.Fragment>
                        &nbsp;
                        <PartyName name={vulnerable.runnerUp.partyCode} partyMap={partyMap} />
                        {" hadde nærmeste kvotient og trengte "}
                        {numberFormat(vulnerable.moreVotesToWin!)}
                        {" flere stemmer for å vinne mandatet. "}
                        <PartyName name={vulnerableVotes.partyCode} partyMap={partyMap} key="vulnerableVotes" />,
                        {" hadde derimot minst margin i stemmer og trengte bare "}
                        {numberFormat(vulnerableVotes.moreVotesToWin!)}
                        {" flere stemmer."}
                    </React.Fragment>;
            } else {
                return <React.Fragment>
                        &nbsp;
                        <PartyName name={vulnerable.runnerUp.partyCode} partyMap={partyMap} />
                        {" hadde nærmeste kvotient og trengte "}
                        {numberFormat(vulnerable.moreVotesToWin!)}
                        {" flere stemmer for å vinne mandatet. "}
                    </React.Fragment>;
            }
        }
        return null;
    }

    render() {
        const partyMap = this.props.partyMap;
        const vulnerable = this.props.vulnerable;
        const vulnerableVotes = this.props.vulnerableVotes;
        
        return (
            <div className="card has-background-primary has-text-light is-size-5">
                <div className="card-content">
                    <p>
                        {"Siste mandat i "}
                        {vulnerable.district}
                        {" gikk til "}
                        <PartyName name={vulnerable.winner.partyCode} partyMap={partyMap} />
                        {". "}
                        {this.getExtendedInfo(vulnerable, vulnerableVotes, partyMap)}
                    </p>
                </div>
            </div>
        );
    }
}
