import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult } from "../../Interfaces/Results";

export interface DistrictOverviewProps {
    districtResults: DistrictResult[];
}

export class DistrictOverview extends React.Component<DistrictOverviewProps, {}> {
    render() {
        const data = this.props.districtResults;
        const highestVotingPower = data
            .map((value) => value.votesPerSeat)
            .reduce((acc, cur) => (cur < acc ? cur : acc));
        const lowestVotingPower = data.map((value) => value.votesPerSeat).reduce((acc, cur) => (cur > acc ? cur : acc));
        const averageVotingPower = data.map((value) => value.votesPerSeat).reduce((acc, cur, ind, arr) => {
            acc += cur;
            if (ind === arr.length - 1) {
                return acc / arr.length;
            } else {
                return acc;
            }
        });
        return (
            <React.Fragment>
                <h2>Mandatfordeling</h2>
                <span>
                    {"En stemme i "}
                    <strong>{data.find((entry) => entry.votesPerSeat === highestVotingPower)!.name}</strong>
                    {" hadde mest innflytelse, og telte "}
                    {((1 / highestVotingPower / (1 / averageVotingPower)) * 100).toFixed(2) + "%"}
                    {" av en gjennomsnittlig stemme"}
                </span>
                <span>
                    {", mens en stemme i "}
                    <strong>{data.find((entry) => entry.votesPerSeat === lowestVotingPower)!.name}</strong>
                    {" hadde minst innflytelse, og bare telte "}
                    {((1 / lowestVotingPower / (1 / averageVotingPower)) * 100).toFixed(2) + "%!"}
                    {" En stemme i det mest innflytelsesrike fylket telte altså "}
                    {((1 / highestVotingPower / (1 / lowestVotingPower)) * 100).toFixed(2) + "%"}
                    {" mer enn en stemme i det minst innflytelsesrike fylket."}
                </span>
                <br />
                <br />
                <ReactTable
                    className="-highlight -striped"
                    defaultPageSize={this.props.districtResults.length}
                    showPaginationBottom={false}
                    data={data}
                    columns={[
                        {
                            Header: "Fylke",
                            accessor: "name",
                            Footer: (
                                <span>
                                    <strong>Alle fylker</strong>
                                </span>
                            )
                        },
                        {
                            Header: "Stemmer",
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>
                                        {data.map((value) => value.votes).reduce((acc, cur) => acc + cur, 0)}
                                    </strong>
                                </span>
                            )
                        },
                        {
                            Header: "Distrikt",
                            accessor: "districtSeats",
                            Footer: (
                                <span>
                                    <strong>
                                        {data.map((value) => value.districtSeats).reduce((acc, cur) => acc + cur, 0)}
                                    </strong>
                                </span>
                            )
                        },
                        {
                            Header: "Utjevning",
                            accessor: "levelingSeats",
                            Footer: (
                                <span>
                                    <strong>
                                        {data.map((value) => value.levelingSeats).reduce((acc, cur) => acc + cur, 0)}
                                    </strong>
                                </span>
                            )
                        },
                        {
                            Header: "Sum",
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>
                                        {data.map((value) => value.totalSeats).reduce((acc, cur) => acc + cur, 0)}
                                    </strong>
                                    <br />
                                </span>
                            )
                        },
                        {
                            Header: "Stemmer/mandat",
                            accessor: "votesPerSeat",
                            Footer: (
                                <span>
                                    <strong>{averageVotingPower}</strong>
                                </span>
                            )
                        }
                    ]}
                />
            </React.Fragment>
        );
    }
}
