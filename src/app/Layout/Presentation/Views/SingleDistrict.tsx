import { DistrictResult, PartyResult } from "../../Interfaces/Results";
import * as React from "react";
import ReactTable, { Column } from "react-table";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
}

export class SingleDistrict extends React.Component<SingleDistrictProps, {}> {
    columns: Column[] = [
        {
            Header: "Parti",
            accessor: "partyCode"
        },
        {
            Header: "Stemmer",
            accessor: "votes"
        },
        {
            Header: "Dis.mandater",
            accessor: "districtSeats"
        },
        {
            Header: "Utj.mandater",
            accessor: "levelingSeats"
        },
        {
            Header: "Mandater",
            accessor: "totalSeats"
        },
        {
            Header: "Prop.",
            accessor: "proportionality"
        }
    ];

    getData(): PartyResult[] {
        return this.props.districtResults.find((district) => district.name === this.props.districtSelected)!
            .partyResults;
    }

    render() {
        const data = this.getData();
        return (
            <React.Fragment>
                <h1 className="h1">{this.props.districtSelected}</h1>
                <ReactTable className="-highlight -striped" data={data} pageSize={data.length} columns={this.columns} />
            </React.Fragment>
        );
    }
}
