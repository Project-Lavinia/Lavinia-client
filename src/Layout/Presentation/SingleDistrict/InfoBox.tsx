import * as React from "react";
import { VulnerableDistrictSeat, VulnerableVotes } from "../../../utilities/district";

interface InfoBoxProps {
    vulnerable: VulnerableDistrictSeat;
    vulnerableVotes: VulnerableVotes;
}

export class InfoBox extends React.Component<InfoBoxProps> {
    render() {
        const vulnerable = this.props.vulnerable;
        const vulnerableVotes = this.props.vulnerableVotes;
        const extendedInfo =
            vulnerable.moreVotesToWin > vulnerableVotes.moreVotesToWin
                ? [
                      " hadde nærmeste kvotient og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å vinne mandatet. ",
                    <abbr title={vulnerableVotes.partyName} key={vulnerableVotes.partyCode}>{vulnerableVotes.partyCode}</abbr>,
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
                        <abbr title={vulnerable.winner.partyName}>{vulnerable.winner.partyCode}</abbr>
                        {". "}&nbsp;
                        <abbr title={vulnerable.runnerUp.partyName}>{vulnerable.runnerUp.partyCode}</abbr>
                        {extendedInfo}
                    </p>
                </div>
            </div>
        );
    }
}
