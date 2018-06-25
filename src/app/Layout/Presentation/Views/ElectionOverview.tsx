import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../Interfaces/Results";

export interface ElectionOverviewProps {
    partyResults: PartyResult[];
}

export class ElectionOverview extends React.Component<
    ElectionOverviewProps,
    {}
> {
    render() {
        return (
            <ReactTable
                className="-highlight -striped"
                data={this.props.partyResults}
                defaultPageSize={10}
                showPaginationBottom={false}
                showPaginationTop={true}
                rowsText="rader"
                pageText="Side"
                ofText="av"
                nextText="Neste"
                previousText="Forrige"
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
                        Header: "Prosent",
                        accessor: "percentVotes"
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
