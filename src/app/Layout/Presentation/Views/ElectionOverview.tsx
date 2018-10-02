import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../Interfaces/Results";

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
                        accessor: "partyName"
                    },
                    {
                        Header: "Stemmer",
                        accessor: "votes"
                    },
                    {
                        Header: "Distrikt",
                        accessor: "districtSeats"
                    },
                    {
                        Header: "Utjevning",
                        accessor: "levelingSeats"
                    },
                    {
                        Header: "Sum",
                        accessor: "totalSeats"
                    },
                    {
                        Header: "Proporsjonalitet",
                        accessor: "proportionality"
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
