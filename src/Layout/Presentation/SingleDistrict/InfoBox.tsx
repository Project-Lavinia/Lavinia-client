import * as React from "react";
import { VulnerableDistrictSeat, VulnerableVotes } from "../../../utilities/district";
import { Dictionary } from "utilities/dictionary";

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
                          <abbr title={partyMap[vulnerableVotes.partyCode]}><b>{vulnerableVotes.partyCode}</b></abbr>,
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
                        <abbr title={partyMap[vulnerable.winner.partyCode]}><b>{vulnerable.winner.partyCode}</b></abbr>
                        {". "}&nbsp;
                        <abbr title={partyMap[vulnerable.runnerUp.partyCode]}><b>{vulnerable.runnerUp.partyCode}</b></abbr>
                        {extendedInfo}
                    </p>
                </div>
            </div>
        );
    }
}
