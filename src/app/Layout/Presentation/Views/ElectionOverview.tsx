import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../Interfaces/Results";
import { toSum } from "../Utilities/ReduceUtilities";

export interface ElectionOverviewProps {
    partyResults: PartyResult[];
    decimals: number;
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
                        Footer: <strong>Utvalg</strong>
                    },
                    {
                        Header: "Stemmer",
                        accessor: "votes",
                        Footer: data.map((value) => value.votes).reduce(toSum)
                    },
                    {
                        Header: "Distrikt",
                        accessor: "districtSeats",
                        Footer: data.map((value) => value.districtSeats).reduce(toSum)
                    },
                    {
                        Header: "Utjevning",
                        accessor: "levelingSeats",
                        Footer: data.map((value) => value.levelingSeats).reduce(toSum)
                    },
                    {
                        Header: "Sum",
                        accessor: "totalSeats",
                        Footer: data.map((value) => value.totalSeats).reduce(toSum)
                    },
                    {
                        Header: "Proporsjonalitet",
                        accessor: "proportionality",
                        Footer: data
                            .map((value) => value.proportionality)
                            .reduce(toSum)
                            .toFixed(this.props.decimals)
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
