import * as React from "react";
import ReactTable, { Column } from "react-table";
import { PartyRestQuotients } from "../../../computation";
import { norwegianLeveling } from "../../../utilities/rt";

interface LevellingSeatOverviewProps {
    levellingSeatQuotients: PartyRestQuotients[];
}

interface LevellingSeatData {
    partyCode: string;
    partyName: string,
    seatsWon: string[];
}

export class LevellingSeatOverview extends React.Component<LevellingSeatOverviewProps> {
    makeData(): LevellingSeatData[] {
        const quotientsArray = this.props.levellingSeatQuotients;
        const seatData: LevellingSeatData[] = [];
        quotientsArray.forEach((party) => {
            seatData.push({ partyCode: party.partyCode, partyName: party.partyName, seatsWon: [] });
        });
        quotientsArray.forEach((party) => {
            const currentIndex = seatData.findIndex((data) => data.partyCode === party.partyCode);
            party.levelingSeats.forEach((quotient) => {
                if (quotient.seatNumber !== 0) {
                    seatData[currentIndex].seatsWon.push(quotient.district);
                }
            });
        });
        return seatData;
    }
    getColumns() {
        const columns: Column[] = [];
        const data = this.makeData();
        if (data.length > 0) {
            const mostSeatsIndex = this.findMostSeatsWon(data);
            for (let i = 0; i < data[mostSeatsIndex].seatsWon.length; i++) {
                // const current = data[i];
                columns.push({
                    Header: `${i + 1}.`,
                    accessor: `seatsWon[${i}]`,
                    minWidth: 150,
                });
            }

            // Set the first column
            columns.unshift({
                Header: "Parti",
                accessor: "partyCode",
                Cell: (row) => {
                    return <abbr title={row.original.partyName}>{row.value}</abbr>
                },
            });
        }
        return columns;
    }
    render() {
        const data = this.makeData();
        const columns = this.getColumns();
        return (
            <React.Fragment>
                <ReactTable
                    className="-highlight -striped has-text-centered"
                    style={{ minHeight: 100 }}
                    data={data}
                    columns={columns}
                    defaultPageSize={data.length > 10 ? 10 : data.length}
                    pageSize={data.length > 10 ? 10 : data.length}
                    showPageSizeOptions={false}
                    showPagination={data.length > 10 ? true : false}
                    {...norwegianLeveling}
                />
            </React.Fragment>
        );
    }
    private findMostSeatsWon(data: LevellingSeatData[]) {
        const seatsWon = data.map((datum) => datum.seatsWon.length);
        return seatsWon.indexOf(Math.max(...seatsWon));
    }
}
