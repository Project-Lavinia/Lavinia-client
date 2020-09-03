import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, PartyResult, SeatResult, AlgorithmType } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import { DistrictSelect } from "./DistrictSelect";
import { norwegian } from "../../../utilities/rt";
import { numberFormat } from "../../../utilities/customNumberFormat";
import { InfoBox } from "./InfoBox";
import {
    getVotesToVulnerableSeatMap,
    getQuotientsToVulnerableSeatMap,
    getVulnerableSeatByQuotient,
    getVulnerableSeatByVotes,
    createPartyResultMap,
} from "../../../utilities/district";
import { isQuotientAlgorithm } from "../../../computation/logic";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
    algorithm: AlgorithmType;
    districtThreshold: number;
    partyMap: _.Dictionary<string>;
}

export class SingleDistrict extends React.Component<SingleDistrictProps, {}> {
    getDistrictResult = (name: string): DistrictResult => {
        const selectedDistrict =
            this.props.districtResults.find((district) => district.name === name) || this.props.districtResults[0];
        return selectedDistrict;
    };

    getData = (): PartyResult[] => {
        const districtResult = this.getDistrictResult(this.props.districtSelected);
        return districtResult.partyResults;
    };

    render() {
        const currentDistrictResult = this.getDistrictResult(this.props.districtSelected)!;
        const data = this.getData()!;
        const partyResultMap = createPartyResultMap(data);
        const calculateVulnerable =
            isQuotientAlgorithm(this.props.algorithm) && currentDistrictResult.districtSeats > 0;
        const vulnerableMap = calculateVulnerable ? getVotesToVulnerableSeatMap(currentDistrictResult) : undefined;
        const quotientMap = calculateVulnerable ? getQuotientsToVulnerableSeatMap(currentDistrictResult) : undefined;
        const vulnerable = calculateVulnerable
            ? getVulnerableSeatByQuotient(currentDistrictResult, partyResultMap, this.props.districtThreshold)
            : undefined;
        const vulnerableVotes = calculateVulnerable
            ? getVulnerableSeatByVotes(currentDistrictResult, partyResultMap, this.props.districtThreshold)
            : undefined;
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
                <DistrictSelect
                    selectDistrict={this.props.selectDistrict}
                    districtSelected={this.props.districtSelected}
                    districtResults={this.props.districtResults}
                />
                {calculateVulnerable && <InfoBox vulnerable={vulnerable!} vulnerableVotes={vulnerableVotes!} partyMap={this.props.partyMap}/>}
                <ReactTable
                    className="-highlight -striped has-text-right"
                    data={data}
                    pageSize={data.length <= 10 ? data.length : 10}
                    showPagination={data.length > 10}
                    columns={[
                        {
                            Header: <span className="is-pulled-left">Parti</span>,
                            accessor: "partyCode",
                            Footer: (
                                <span>
                                    <strong className="is-pulled-left">Utvalg</strong>
                                </span>
                            ),
                            Cell: (row) => {
                                return <span className="is-pulled-left">{row.original.partyName}</span>;
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
                            accessor: (d: PartyResult) =>
                                partyResultMap[d.partyCode].percentVotes > this.props.districtThreshold && vulnerableMap
                                    ? vulnerableMap.get(d.partyCode)
                                    : null,
                            Cell: (row) => {
                                const value = numberFormat(row.value);  
                                if (vulnerableVotes && row.original.partyCode === vulnerableVotes.partyCode) {
                                    return <div className="has-background-dark has-text-white">{value}</div>;
                                }
                                if (vulnerableVotes && row.original.partyCode === vulnerableVotes.winner.partyCode) {
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
                            accessor: (d: PartyResult) =>
                                partyResultMap[d.partyCode].percentVotes > this.props.districtThreshold && quotientMap
                                ? quotientMap.get(d.partyCode)
                                : null,
                            Cell: (row) => {
                                const value = row.value ? numberFormat(row.value, this.props.decimals) : row.value;
                                if (vulnerable && row.original.partyCode === vulnerable.runnerUp?.partyCode) {
                                    return <div className="has-background-dark has-text-white">{value}</div>;
                                }
                                return value;
                            },
                            show: calculateVulnerable,
                        },
                        {
                            Header: <span className="is-pulled-right wrap" >Prop. %</span>,
                            accessor: "proportionality",
                            Cell: (row) => {
                               return numberFormat(row.value, decimals);
                            },
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
                            id: "totalSeats",
                            desc: true,
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
