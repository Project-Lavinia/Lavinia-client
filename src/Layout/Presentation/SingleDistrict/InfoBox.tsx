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
                      " hadde nærmest kvotient og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å vinne mandatet. ",
                      <span key={vulnerableVotes.partyCode} className="has-text-warning">
                          {vulnerableVotes.partyCode}
                      </span>,
                      " hadde derimot minst margin i stemmer og trengte bare ",
                      vulnerableVotes.moreVotesToWin,
                      ".",
                  ]
                : [
                      " hadde nærmest kvotient, og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å ta mandatet. ",
                  ];

        return (
            <div className="card has-background-dark has-text-light">
                <div className="card-content">
                    <p>
                        {"Sistemandat i "}
                        {vulnerable.district}
                        {" gikk til "}
                        {<span className="has-text-success">{vulnerable.winner.partyCode}</span>}
                        {". "}&nbsp;
                        {<span className="has-text-warning">{vulnerable.runnerUp.partyCode}</span>}
                        {extendedInfo}
                    </p>
                </div>
            </div>
        );
    }
}
