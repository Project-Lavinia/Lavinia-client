import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../Interfaces/Results";
import { toSum } from "../Utilities/ReduceUtilities";

export interface ElectionOverviewProps {
    partyResults: PartyResult[];
    decimals: number;
    partyNameWidth: number;
}

export class ElectionOverview extends React.Component<ElectionOverviewProps, {}> {
    render() {
        const data = this.props.partyResults;
        return (
            <ReactTable
                className="-highlight -striped"
                data={data}
                defaultPageSize={data.length >= 10 ? 10 : data.length}
                pageSize={data.length >= 10 ? 10 : data.length}
                showPagination={data.length > 10}
                showPageSizeOptions={false}
                ofText={"/"}
                nextText={"→"}
                previousText={"←"}
                pageText={"#"}
                columns={[
                    {
                        Header: "Parti",
                        accessor: "partyName",
                        width: this.props.partyNameWidth * 8,
                        Footer: <strong>Utvalg</strong>
                    },
                    {
                        Header: "Stemmer",
                        accessor: "votes",
                        Footer: <strong>{data.map((value) => value.votes).reduce(toSum)}</strong>
                    },
                    {
                        Header: "Distrikt",
                        accessor: "districtSeats",
                        Footer: <strong>{data.map((value) => value.districtSeats).reduce(toSum)}</strong>
                    },
                    {
                        Header: "Utjevning",
                        accessor: "levelingSeats",
                        Footer: <strong>{data.map((value) => value.levelingSeats).reduce(toSum)}</strong>
                    },
                    {
                        Header: "Sum",
                        accessor: "totalSeats",
                        Footer: <strong>{data.map((value) => value.totalSeats).reduce(toSum)}</strong>
                    },
                    {
                        Header: "Proporsjonalitet",
                        accessor: "proportionality",
                        Footer: (
                            <strong>
                                {data
                                    .map((value) => value.proportionality)
                                    .reduce(toSum)
                                    .toFixed(this.props.decimals)}
                            </strong>
                        )
                    }
                ]}
                defaultSorted={[
                    {
                        id: "totalSeats",
                        desc: true
                    }
                ]}
            />
        );
    }
}
