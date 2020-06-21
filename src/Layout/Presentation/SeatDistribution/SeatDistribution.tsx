import * as React from "react";
import ReactTable, { Column } from "react-table";
import { DistrictResult } from "../../../computation/computation-models";
import { norwegian } from "../../../utilities/rt";

export interface SeatDistributionProps {
    districtResults: DistrictResult[];
    districtWidth: number;
}

export class SeatDistribution extends React.Component<SeatDistributionProps, {}> {
    generateColumns(): Column[] {
        const columns: Column[] = [
            {
                Header: <span className="is-pulled-left"> {"Fylker"}</span> ,
                accessor: "name",
                width: this.props.districtWidth * 10,
                Cell: (row) => {
                    return <span className="is-pulled-left" >{row.value}</span>
                },            
            },
        ];

        for (const districtResult of this.props.districtResults) {
            districtResult.partyResults.sort((v, t) => v.partyCode.localeCompare(t.partyCode));
        }

        if (this.props.districtResults.length > 0) {
            for (let partyIndex = 0; partyIndex < this.props.districtResults[0].partyResults.length; partyIndex++) {
                const element = this.props.districtResults[0].partyResults[partyIndex];
                columns.push({
                    Header: element.partyCode,
                    accessor: `partyResults[${partyIndex}].totalSeats`,
                    minWidth: 50,
                });
            }
        }

        return columns;
    }

    render() {
        return (
            <React.Fragment>
                <ReactTable
                    className="-highlight -striped has-text-centered"
                    defaultPageSize={19}
                    showPaginationBottom={false}
                    data={this.props.districtResults}
                    columns={this.generateColumns()}
                    {...norwegian}
                />
            </React.Fragment>
        );
    }
}
