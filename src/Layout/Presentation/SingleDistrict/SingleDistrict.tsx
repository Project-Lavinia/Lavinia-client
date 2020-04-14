import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, PartyResult, SeatResult } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import {
    getVulnerableSeatByQuotient,
    getVulnerableSeatByVotes,
    getVotesToVulnerableSeatMap,
    getQuotientsToVulnerableSeatMap,
    getPartyNameByPartyCode,
} from "../../../utilities/district";
import { DistrictSelect } from "./DistrictSelect";
import { norwegian } from "../../../utilities/rt";
import { roundNumber } from "../../../utilities/number";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
}

export class SingleDistrict extends React.Component<SingleDistrictProps, {}> {
    getDistrictResult = (name: string): DistrictResult | undefined => {
        return this.props.districtResults.find((district) => district.name === name);
    };
    getData = (): PartyResult[] | undefined => {
        const districtResult = this.getDistrictResult(this.props.districtSelected);
        return districtResult ? districtResult.partyResults : undefined;
    };

    render() {
        const data = this.getData()!;
        const decimals = this.props.decimals;
        const proportionalities = data.map((value) => value.proportionality);
        const currentDistrictResult = this.getDistrictResult(this.props.districtSelected);
        const vulnerableMap = getVotesToVulnerableSeatMap(currentDistrictResult!);
        const quotientMap = getQuotientsToVulnerableSeatMap(currentDistrictResult!);
        const vulnerable = getVulnerableSeatByQuotient(currentDistrictResult!);
        const vulnerableVotes = getVulnerableSeatByVotes(currentDistrictResult!);
        const vulnerableWinnerPartyName = getPartyNameByPartyCode(currentDistrictResult!, vulnerable.winner.partyCode);
        const vulnerableQuotientPartyName = getPartyNameByPartyCode(
            currentDistrictResult!,
            vulnerable.runnerUp.partyCode
        );
        const vulnerableVotesPartyName = getPartyNameByPartyCode(currentDistrictResult!, vulnerableVotes.partyCode);
        console.log(process.env.DEBUG);
        console.log(`Vulnerable by votes: ${vulnerableVotes.partyCode}: ${vulnerableVotes.moreVotesToWin}`);
        let label: string;
        let index: number;
        switch (this.props.disproportionalityIndex) {
            case DisproportionalityIndex.LOOSEMORE_HANBY: {
                label = "L-H";
                index = proportionalities.map((value) => Math.abs(value)).reduce(toSum, 0) / 2;
                break;
            }
            case DisproportionalityIndex.GALLAGHER: {
                label = "LSq";
                index = Math.sqrt(proportionalities.map((value) => value * value).reduce(toSum, 0) / 2);
                break;
            }
            default: {
                checkExhaustively(this.props.disproportionalityIndex);
                label = "Error";
                index = -1;
            }
        }
        const blackBoxComment =
            vulnerable.moreVotesToWin > vulnerableVotes.moreVotesToWin
                ? [
                      " hadde nærmest kvotient. ",
                      <span key="99" className="has-text-warning">
                          {vulnerableVotesPartyName}
                      </span>,
                      " hadde derimot minst margin og trengte kun ",
                      vulnerableVotes.moreVotesToWin,
                      " flere stemmer for å ta det siste mandatet.",
                  ]
                : [
                      " hadde nærmest kvotient, og trengte ",
                      vulnerable.moreVotesToWin,
                      " flere stemmer for å ta mandatet. ",
                  ];
        return (
            <React.Fragment>
                <DistrictSelect
                    selectDistrict={this.props.selectDistrict}
                    districtSelected={this.props.districtSelected}
                    districtResults={this.props.districtResults}
                />
                <div className="card has-background-dark has-text-light">
                    <div className="card-content">
                        <p>
                            {"Sistemandat i "}
                            {this.props.districtSelected}
                            {" gikk til "}
                            {<span className="has-text-success">{vulnerableWinnerPartyName}</span>}
                            {". "}&nbsp;
                            {<span className="has-text-warning">{vulnerableQuotientPartyName}</span>}
                            {blackBoxComment}
                        </p>
                    </div>
                </div>

                <ReactTable
                    className="-highlight -striped has-text-centered"
                    data={data}
                    pageSize={data.length <= 10 ? data.length : 10}
                    showPagination={data.length > 10}
                    columns={[
                        {
                            Header: "Parti",
                            accessor: "partyCode",
                            Cell: (data) => {
                                const showFullName = (
                                    <span title={data.original.partyName + " vant siste mandat"}>{data.value}</span>
                                );
                                return data.row.partyCode === vulnerable.winner.partyCode ? (
                                    <b>{showFullName}</b>
                                ) : (
                                    showFullName
                                );
                            },
                            Footer: (
                                <span>
                                    <strong>Utvalg</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Stemmer",
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.votes).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "%",
                            id: "%",
                            accessor: (d: PartyResult) => roundNumber(d.percentVotes, decimals),
                        },
                        {
                            Header: "Distrikt",
                            accessor: "districtSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.districtSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Utjevning",
                            accessor: "levelingSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.levelingSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Sum Mandater",
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.totalSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            id: "marginInVotes",
                            Header: "Margin i stemmer",
                            Cell: (data) => {
                                if (data.row.partyCode === vulnerableVotes.partyCode) {
                                    const closestMargin = (
                                        <span title={"Minst margin i antall stemmer for å ta siste mandat"}>
                                            {data.value}
                                        </span>
                                    );
                                    return <b>{closestMargin}</b>;
                                }
                                return data.value;
                            },
                            accessor: (d: PartyResult) => vulnerableMap.get(d.partyCode),
                        },
                        {
                            id: "lastSeatQuotient",
                            Header: "Siste kvotient",
                            Cell: (data) => {
                                if (data.row.partyCode === vulnerable.runnerUp.partyCode) {
                                    const closestQuotient = <span title={"Nærmeste kvotient"}>{data.value}</span>;
                                    return <b>{closestQuotient}</b>;
                                }
                                return data.value;
                            },
                            accessor: (d: PartyResult) => quotientMap.get(d.partyCode)!.toFixed(decimals),
                        },
                        {
                            Header: "Prop.",
                            accessor: "proportionality",
                            Footer: (
                                <span>
                                    <strong>
                                        {label}: {index.toFixed(decimals)}
                                    </strong>
                                </span>
                            ),
                        },
                    ]}
                    showPageSizeOptions={false}
                    {...norwegian}
                />
            </React.Fragment>
        );
    }
    getLastSeat = (): SeatResult | undefined => {
        const districtResult = this.getDistrictResult(this.props.districtSelected);
        if (districtResult) {
            return districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
        }
        return undefined;
    };
}
