import * as React from "react";
import { PartyRestQuotients } from "../../Interfaces/Results";
import ReactTable, { Column } from "react-table";

interface LevellingSeatOverviewProps {
    levellingSeatQuotients: PartyRestQuotients[];
}

interface LevellingSeatData {
    partyCode: string;
    seatsWon: string[];
}

export class LevellingSeatOverview extends React.Component<LevellingSeatOverviewProps> {
    makeData(): LevellingSeatData[] {
        const quotientsArray = this.props.levellingSeatQuotients;
        const parties = quotientsArray.map((quotients) => {
            return quotients.partyCode;
        });
        const seatData: LevellingSeatData[] = [];
        parties.forEach((party) => {
            seatData.push({ partyCode: party, seatsWon: [] });
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
        const mostSeatsIndex = this.findMostSeatsWon(data);
        for (let i = 0; i < data[mostSeatsIndex].seatsWon.length; i++) {
            // const current = data[i];
            columns.push({
                Header: `${i + 1}.`,
                accessor: `seatsWon[${i}]`,
                minWidth: 150
            });
        }

        // Set the first column
        columns.unshift({
            Header: "Parti",
            accessor: "partyCode"
        });
        return columns;
    }
    render() {
        const data = this.makeData();
        const columns = this.getColumns();
        return (
            <React.Fragment>
                <h3>Utjevningsmandater</h3>
                <ReactTable
                    className="-highlight -striped"
                    data={data}
                    columns={columns}
                    defaultPageSize={data.length > 10 ? 10 : data.length}
                    pageSize={data.length > 10 ? 10 : data.length}
                    showPageSizeOptions={false}
                    showPagination={data.length > 10 ? true : false}
                    ofText={"/"}
                    nextText={"→"}
                    previousText={"←"}
                    pageText={"#"}
                />
            </React.Fragment>
        );
    }
    private findMostSeatsWon(data: LevellingSeatData[]) {
        const seatsWon = data.map((datum) => datum.seatsWon.length);
        return seatsWon.indexOf(Math.max(...seatsWon));
    }
}
