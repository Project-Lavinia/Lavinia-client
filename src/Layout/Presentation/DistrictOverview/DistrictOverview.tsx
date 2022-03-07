import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, AlgorithmType } from "../../../computation";
import { toMin, toMax, toMean, toSum } from "../../../utilities/reduce";
import { getMostVulnerableSeatByQuotient } from "../../../utilities/district";
import { norwegian } from "../../../utilities/rt";
import { isQuotientAlgorithm } from "../../../computation/logic";
import { VulnerableDistrictSeatText } from "./VulnerableDistrictSeatText";
import { numberFormat } from "../../../utilities/customNumberFormat";

export interface DistrictOverviewProps {
    districtResults: DistrictResult[];
    districtWidth: number;
    decimals: number;
    algorithm: AlgorithmType;
    districtThreshold: number;
    partyMap: _.Dictionary<string>;
}

export class DistrictOverview extends React.Component<DistrictOverviewProps, {}> {

    render() {
        const data = this.props.districtResults;
        const decimals = this.props.decimals;
        const highestVotingPower = data.map((value) => value.votesPerSeat).reduce(toMin);
        const lowestVotingPower = data.map((value) => value.votesPerSeat).reduce(toMax);
        const averageVotingPower = data.map((value) => value.votesPerSeat).reduce(toMean);
        const highestVsAverageInPercentage = (1 / highestVotingPower / (1 / averageVotingPower)) * 100;
        const lowestVsAverageInPercentage = (1 / lowestVotingPower / (1 / averageVotingPower)) * 100;
        const mostWeightedDistrict = data.find((entry) => entry.votesPerSeat === highestVotingPower)!.name;
        const leastWeightedDistrict = data.find((entry) => entry.votesPerSeat === lowestVotingPower)!.name;
        const calculateVulnerable = isQuotientAlgorithm(this.props.algorithm);
        const mostVulnerable = calculateVulnerable
            ? getMostVulnerableSeatByQuotient(data, this.props.districtThreshold)
            : undefined;
        return (
            <React.Fragment>
                <div className="card has-background-primary has-text-light is-size-5">
                    <p className="card-content">
                        {"En stemme i "}
                        {mostWeightedDistrict}
                        {" hadde mest vekt, og telte "}
                        {numberFormat(highestVsAverageInPercentage, decimals) + "%"}
                        {" av en gjennomsnittlig stemme"}
                        {", mens en stemme i "}
                        {leastWeightedDistrict}
                        {" hadde minst vekt, og bare telte "}
                        {numberFormat(lowestVsAverageInPercentage, decimals) + "%."}
                        <VulnerableDistrictSeatText mostVulnerable={mostVulnerable} partyMap={this.props.partyMap} />
                    </p>
                </div>

                <ReactTable
                    className="-highlight -striped has-text-right"
                    defaultPageSize={20}
                    pageSize={20}
                    showPaginationBottom={this.props.districtResults.length > 20}
                    data={data}
                    {...norwegian}
                    columns={[
                        {
                            Header: <span className="is-pulled-left">Fylke</span> ,
                            accessor: "name",
                            width: this.props.districtWidth * 10,
                            Cell: (row) => {
                                return <span className="is-pulled-left" >{row.value}</span>;
                            },
                            Footer: (
                                <span>
                                    <strong className="is-pulled-left">Alle fylker</strong>
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right">Stemmer</span> ,
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>{numberFormat(data.map((value) => value.votes).reduce(toSum, 0))}</strong>
                                </span>
                            ),
                            Cell: (row) => {
                                return numberFormat(row.value);
                            },
                        },
                        {
                            Header: <span className="is-pulled-right"> Distrikt</span>,
                            accessor: "districtSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.districtSeats).reduce(toSum, 0)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right"> Utjevning</span>,
                            accessor: "levelingSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.levelingSeats).reduce(toSum, 0)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right">Sum</span>,
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.totalSeats).reduce(toSum, 0)}</strong>
                                    <br />
                                </span>
                            ),
                        },
                        {
                            Header: <span className="is-pulled-right wrap">Stemmer / mandat</span>,
                            accessor: "votesPerSeat",
                            Cell: (row) => {
                                return numberFormat(row.value, decimals);
                            },
                            Footer: (
                                <span>
                                    <strong>{numberFormat(averageVotingPower, decimals)}</strong>
                                </span>
                            ),
                        },
                    ]}
                />
            </React.Fragment>
        );
    }
}
