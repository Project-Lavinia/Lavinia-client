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
        // Base column for district name
        const baseColumn: Column = {
            Header: <span className="is-pulled-left">{"Fylker"}</span>,
            accessor: "name",
            width: this.props.districtWidth * 10,
            Cell: (row) => <span className="is-pulled-left">{row.value}</span>,
        };

        // Collect the union of all parties across districts
        const partyNameByCode = new Map<string, string>();
        const partyCodes = new Set<string>();

        for (const dr of this.props.districtResults || []) {
            if (!dr || !dr.partyResults) { continue; }
            for (const pr of dr.partyResults) {
                if (!pr) { continue; }
                partyCodes.add(pr.partyCode);
                // prefer the first encountered name for the code
                if (!partyNameByCode.has(pr.partyCode)) {
                    partyNameByCode.set(pr.partyCode, pr.partyName);
                }
            }
        }

        const sortedPartyCodes = Array.from(partyCodes).sort((a, b) => a.localeCompare(b));

        const columns: Column[] = [baseColumn];

        const createPartyColumn = (code: string): Column => ({
            Header: <abbr title={partyNameByCode.get(code) || code}>{code}</abbr>,
            id: code,
            accessor: (d: DistrictResult) => {
                const pr = d.partyResults
                    && d.partyResults.find((p) => p.partyCode === code);
                return pr ? pr.totalSeats : 0;
            },
            minWidth: 50,
        });

        for (const code of sortedPartyCodes) {
            const partyColumn = createPartyColumn(code);
            columns.push(partyColumn);
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
