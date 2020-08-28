import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, AlgorithmType } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import { PartySelect } from "./PartySelect";
import { norwegian } from "../../../utilities/rt";
import { roundNumber } from "../../../utilities/number";
import {
    getVotesToVulnerableSeatMap,
    getQuotientsToVulnerableSeatMap,
    getVulnerableSeatByQuotient,
    getVulnerableSeatByVotes,
    createPartyResultMap,
    VulnerableVotes,
} from "../../../utilities/district";
import { isQuotientAlgorithm } from "../../../computation/logic";

export interface SinglePartyProps {
    districtResults: DistrictResult[];
    partyCodeList: string[];
    partySelected: string;
    selectParty: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
    algorithm: AlgorithmType;
    districtThreshold: number;
    districtSeats: number;
    firstDivisor: number;
    partyMap: _.Dictionary<string>;
}

interface SinglePartyResult {
    district: string;
    votes: number;
    percentVotes: number;
    districtSeats: number;
    levelingSeats: number;
    totalSeats: number;
    marginInVotes: number;
    seatWinner: boolean;
    closestVotes: boolean;
    quotientMargin: number;
    closestQuotient: boolean;
    proportionality: number;
}

function getMarginInVotes(partyCode: string, vulnerableMap: Map<string, number> | undefined, vulnerableVotes: VulnerableVotes | undefined, firstDivisor: number): number {
    if (vulnerableMap) {
        const vulnerableVotes = vulnerableMap.get(partyCode);
        if (vulnerableVotes) {
            return vulnerableVotes;
        }
    }

    if (vulnerableVotes) {
        return Math.floor(vulnerableVotes.winner.quotient * firstDivisor) + 1;
    }

    return 0;
}

export class SingleParty extends React.Component<SinglePartyProps, {}> {
    getData(calculateVulnerable: boolean, partyCode: string): SinglePartyResult[] {
        return this.props.districtResults.map((districtResult) => {
            const partyResultMap = createPartyResultMap(districtResult.partyResults);
            const vulnerable = calculateVulnerable
                ? getVulnerableSeatByQuotient(districtResult, partyResultMap, this.props.districtThreshold)
                : undefined;
            const vulnerableVotes = calculateVulnerable
                ? getVulnerableSeatByVotes(districtResult, partyResultMap, this.props.districtThreshold)
                : undefined;
            const vulnerableMap = calculateVulnerable ? getVotesToVulnerableSeatMap(districtResult) : undefined;
            const quotientMap = calculateVulnerable ? getQuotientsToVulnerableSeatMap(districtResult) : undefined;
            const partyResult = districtResult.partyResults.find((result) => result.partyCode === partyCode);
            return {
                district: districtResult.name,
                votes: partyResult?.votes || 0,
                percentVotes: partyResult?.percentVotes || 0,
                districtSeats: partyResult?.districtSeats || 0,
                levelingSeats: partyResult?.levelingSeats || 0,
                totalSeats: partyResult?.totalSeats || 0,
                marginInVotes: getMarginInVotes(partyCode, vulnerableMap, vulnerableVotes, this.props.firstDivisor),
                seatWinner: vulnerableVotes ? vulnerableVotes.winner.partyCode === partyCode : false,
                closestVotes: vulnerableVotes ? vulnerableVotes.partyCode === partyCode : false,
                quotientMargin: quotientMap?.get(partyCode) || 0,
                closestQuotient: vulnerable ? vulnerable.runnerUp?.partyCode === partyCode : false,
                proportionality: partyResult?.proportionality || 0
            };
        });
    }

    render() {
        const partyCodeList = this.props.partyCodeList;
        const partyCode = partyCodeList.indexOf(this.props.partySelected) >= 0 ? this.props.partySelected : partyCodeList[0];

        const calculateVulnerable =
        isQuotientAlgorithm(this.props.algorithm) && this.props.districtSeats > 0;
        const data = this.getData(calculateVulnerable, partyCode)!;
        const decimals = this.props.decimals;
        const proportionalities = data.map((value) => value.proportionality);
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
        return (
            <React.Fragment>
                <PartySelect
                    selectParty={this.props.selectParty}
                    partyCodeList={partyCodeList}
                    partySelected={this.props.partySelected}
                    partyMap={this.props.partyMap}
                />
                <ReactTable
                    className="-highlight -striped has-text-centered"
                    data={data}
                    pageSize={this.props.districtResults.length}
                    showPaginationBottom={false}
                    columns={[
                        {
                            Header: "Fylke",
                            accessor: "district",
                            Footer: (
                                <span>
                                    <strong>Utvalg</strong>
                                </span>
                            )
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
                            accessor: (d: SinglePartyResult) => roundNumber(d.percentVotes, decimals),
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
                            accessor: "marginInVotes",
                            Cell: (row) => {
                                if ( row.original.closestVotes ) {
                                    return <div className="has-background-dark has-text-white">{row.value}</div>;
                                }
                                if ( row.original.seatWinner ) {
                                    return (
                                        <span className="icon">
                                            <i className="fas fa-trophy" />
                                        </span>
                                    );
                                }
                                return row.value;
                            },
                            show: calculateVulnerable,
                        },
                        {
                            id: "lastSeatQuotient",
                            Header: "Siste kvotient",
                            accessor: (d: SinglePartyResult) => roundNumber(d.quotientMargin, decimals),
                            Cell: (row) => {
                                if ( row.original.closestQuotient ) {
                                    return <div className="has-background-dark has-text-white">{row.value}</div>;
                                }
                                return row.value;
                            },
                            show: calculateVulnerable,
                        },
                        {
                            Header: "Prop. %",
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
                    defaultSorted={[
                        {
                            id: "district",
                            desc: false,
                        },
                    ]}
                    showPageSizeOptions={false}
                    {...norwegian}
                />
            </React.Fragment>
        );
    }
}
