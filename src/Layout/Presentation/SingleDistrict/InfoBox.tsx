import * as React from "react";
import { VulnerableDistrictSeat, VulnerableVotes } from "../../../utilities/district";
import { Dictionary } from "../../../utilities/dictionary";
import { PartyName } from "../../../common/PartyName";

interface InfoBoxProps {
    vulnerable: VulnerableDistrictSeat;
    vulnerableVotes: VulnerableVotes;
    partyMap: Dictionary<string>;
}

export class InfoBox extends React.Component<InfoBoxProps> {
    render() {
        const partyMap = this.props.partyMap;
        const vulnerable = this.props.vulnerable;
        const vulnerableVotes = this.props.vulnerableVotes;
        const extendedInfo =
            vulnerable.moreVotesToWin > vulnerableVotes.moreVotesToWin
                ? [
                      " hadde nærmeste kvotient og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å vinne mandatet. ",
                      <PartyName name={vulnerableVotes.partyCode} partyMap={partyMap} key="vulnerableVotes" />,
                      " hadde derimot minst margin i stemmer og trengte bare ",
                      vulnerableVotes.moreVotesToWin,
                      " flere stemmer.",
                  ]
                : [
                      " hadde nærmeste kvotient og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å ta mandatet. ",
                  ];

        return (
            <div className="card has-background-primary has-text-light is-size-5">
                <div className="card-content">
                    <p>
                        {"Sistemandat i "}
                        {vulnerable.district}
                        {" gikk til "}
                        <PartyName name={vulnerable.winner.partyCode} partyMap={partyMap} />
                        {". "}&nbsp;
                        <PartyName name={vulnerable.runnerUp.partyCode} partyMap={partyMap} />
                        {extendedInfo}
                    </p>
                </div>
            </div>
        );
    }
}
