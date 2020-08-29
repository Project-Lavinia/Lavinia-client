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
import { numberFormat } from "../../../utilities/customNumberFormat";

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
    constructSinglePartyResult(districtResult: DistrictResult, calculateVulnerable: boolean, partyCode: string): SinglePartyResult {
        const partyResultMap = createPartyResultMap(districtResult.partyResults);
        const partyResult = districtResult.partyResults.find((result) => result.partyCode === partyCode);

        const vulnerable = calculateVulnerable
            ? getVulnerableSeatByQuotient(districtResult, partyResultMap, this.props.districtThreshold)
            : undefined;
        const vulnerableVotes = calculateVulnerable
            ? getVulnerableSeatByVotes(districtResult, partyResultMap, this.props.districtThreshold)
            : undefined;

        const vulnerableMap = calculateVulnerable ? getVotesToVulnerableSeatMap(districtResult) : undefined;
        const quotientMap = calculateVulnerable ? getQuotientsToVulnerableSeatMap(districtResult) : undefined;

        if (partyResult) {
            return {
                district: districtResult.name,
                votes: partyResult.votes,
                percentVotes: partyResult.percentVotes,
                districtSeats: partyResult.districtSeats,
                levelingSeats: partyResult.levelingSeats,
                totalSeats: partyResult.totalSeats,
                marginInVotes: getMarginInVotes(partyCode, vulnerableMap, vulnerableVotes, this.props.firstDivisor),
                seatWinner: vulnerableVotes?.winner.partyCode === partyCode,
                closestVotes: vulnerableVotes?.partyCode === partyCode,
                quotientMargin: quotientMap?.get(partyCode) || 0,
                closestQuotient: vulnerable?.runnerUp?.partyCode === partyCode,
                proportionality: partyResult.proportionality
            };
        } else {
            return {
                district: districtResult.name,
                votes: 0,
                percentVotes: 0,
                districtSeats: 0,
                levelingSeats: 0,
                totalSeats: 0,
                marginInVotes: getMarginInVotes(partyCode, vulnerableMap, vulnerableVotes, this.props.firstDivisor),
                seatWinner: vulnerableVotes?.winner.partyCode === partyCode,
                closestVotes: vulnerableVotes?.partyCode === partyCode,
                quotientMargin: quotientMap?.get(partyCode) || 0,
                closestQuotient: vulnerable?.runnerUp?.partyCode === partyCode,
                proportionality: 0
            };
        }
    }

    render() {
        const partyCodeList = this.props.partyCodeList;
        const partyCode = partyCodeList.indexOf(this.props.partySelected) >= 0 ? this.props.partySelected : partyCodeList[0];

        const calculateVulnerable =
        isQuotientAlgorithm(this.props.algorithm) && this.props.districtSeats > 0;
        const data = this.props.districtResults.map((districtResult) => this.constructSinglePartyResult(districtResult, calculateVulnerable, partyCode));
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
                    className="-highlight -striped has-text-right"
                    data={data}
                    pageSize={this.props.districtResults.length}
                    showPaginationBottom={false}
                    columns={[
                        {
                            Header: <span className="is-pulled-left">Fylke</span>,
                            accessor: "district",
                            Footer: (
                                <span>
                                    <strong className="is-pulled-left">Alle fylker</strong>
                                </span>
                            ),
                            Cell: (row) => {
                                return <span className="is-pulled-left">{row.value}</span>;
                            },
                        },
                        {
                            Header: <span className="is-pulled-right">Stemmer</span>,
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>{numberFormat(data.map((value) => value.votes).reduce(toSum))}</strong>
                                </span>
                            ),
                            Cell: (row) => {
                                return numberFormat(row.value);
                            },
                        },
                        {
                            Header: <span className="is-pulled-right wrap" >Oppslutning %</span>,
                            id: "%",
                            accessor: "percentVotes",
                            Cell: (row) => {
                                return numberFormat(row.value, decimals);
                            },
                        },
                        {
                            Header: <span className="is-pulled-right" >Distrikt</span>,
                            accessor: "districtSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.districtSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right" >Utjevning</span>,
                            accessor: "levelingSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.levelingSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right wrap" >Sum Mandater</span>,
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.totalSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            id: "marginInVotes",
                            Header: <span className="is-pulled-right wrap" >Margin i stemmer</span>,
                            accessor: "marginInVotes",
                            Cell: (row) => {
                                const value = numberFormat(row.value);  
                                if ( row.original.closestVotes ) {
                                    return <div className="has-background-dark has-text-white">{value}</div>;
                                }
                                if ( row.original.seatWinner ) {
                                    return (
                                        <span className="icon">
                                            <i className="fas fa-trophy" />
                                        </span>
                                    );
                                }
                                return value;
                            },
                            show: calculateVulnerable,
                        },
                        {
                            id: "lastSeatQuotient",
                            Header: <span className="is-pulled-right wrap" >Siste kvotient</span>,
                            accessor: (d: SinglePartyResult) => roundNumber(d.quotientMargin, decimals),
                            Cell: (row) => {
                                const value = row.value ? numberFormat(row.value, this.props.decimals) : row.value;
                                if ( row.original.closestQuotient ) {
                                    return <div className="has-background-dark has-text-white">{value}</div>;
                                }
                                return value;
                            },
                            show: calculateVulnerable,
                        },
                        {
                            Header: <span className="is-pulled-right wrap" >Prop. %</span>,
                            accessor: "proportionality",
                            Footer: (
                                <span>
                                    <strong>
                                        {label}: {numberFormat(index, decimals)}
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
