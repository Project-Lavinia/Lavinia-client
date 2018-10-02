import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult } from "../../Interfaces/Results";

export interface DistrictOverviewProps {
    districtResults: DistrictResult[];
}

export class DistrictOverview extends React.Component<DistrictOverviewProps, {}> {
    render() {
        return (
            <ReactTable
                className="-highlight -striped"
                defaultPageSize={this.props.districtResults.length}
                showPaginationBottom={false}
                data={this.props.districtResults}
                columns={[
                    {
                        Header: "Fylke",
                        accessor: "name"
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
                        Header: "Stemmer/mandat",
                        accessor: "votesPerSeat"
                    }
                ]}
            />
        );
    }
}
