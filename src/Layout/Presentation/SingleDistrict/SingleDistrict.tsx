import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, PartyResult, SeatResult, AlgorithmType } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import { DistrictSelect } from "./DistrictSelect";
import { norwegian } from "../../../utilities/rt";
import { roundNumber } from "../../../utilities/number";
import { InfoBox } from "./InfoBox";
import {
    getVotesToVulnerableSeatMap,
    getQuotientsToVulnerableSeatMap,
    getVulnerableSeatByQuotient,
    getVulnerableSeatByVotes,
} from "../../../utilities/district";
import { isQuotientAlgorithm } from "../../../computation/logic";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
    algorithm: AlgorithmType;
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
        const currentDistrictResult = this.getDistrictResult(this.props.districtSelected);
        const calculateVulnerable =
            isQuotientAlgorithm(this.props.algorithm) && currentDistrictResult.districtSeats > 0;
        const vulnerableMap = calculateVulnerable ? getVotesToVulnerableSeatMap(currentDistrictResult!) : undefined;
        const quotientMap = calculateVulnerable ? getQuotientsToVulnerableSeatMap(currentDistrictResult!) : undefined;
        const vulnerable = calculateVulnerable ? getVulnerableSeatByQuotient(currentDistrictResult!) : undefined;
        const vulnerableVotes = calculateVulnerable ? getVulnerableSeatByVotes(currentDistrictResult!) : undefined;
        const data = this.getData()!;
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
                {calculateVulnerable && <InfoBox vulnerable={vulnerable!} vulnerableVotes={vulnerableVotes!} />}
                <ReactTable
                    className="-highlight -striped has-text-centered"
                    data={data}
                    pageSize={data.length <= 10 ? data.length : 10}
                    showPagination={data.length > 10}
                    columns={[
                        {
                            Header: "Parti",
                            accessor: "partyCode",
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
                            accessor: (d: PartyResult) =>
                                d.votes > 0 && vulnerableMap ? vulnerableMap.get(d.partyCode) : null,
                            Cell: (row) => {
                                if (vulnerableVotes && row.original.partyCode === vulnerableVotes.partyCode) {
                                    return <div className="has-background-dark has-text-white">{row.value}</div>;
                                }
                                if (vulnerableVotes && row.original.partyCode === vulnerableVotes.winner.partyCode) {
                                    return (
                                        <span className="icon">
                                            {" "}
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
                            accessor: (d: PartyResult) =>
                                d.votes > 0 && quotientMap ? quotientMap.get(d.partyCode)!.toFixed(decimals) : null,
                            Cell: (row) => {
                                if (vulnerable && row.original.partyCode === vulnerable.runnerUp.partyCode) {
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
