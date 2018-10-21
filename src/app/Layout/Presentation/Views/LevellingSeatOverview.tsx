import * as React from "react";
import { SeatResult } from "../../Interfaces/Results";
import ReactTable from "react-table";

interface LevellingSeatOverviewProps {
    decimals: number;
    seatResults: SeatResult[];
}

export class LevellingSeatOverview extends React.Component<LevellingSeatOverviewProps> {
    render() {
        return (
            <React.Fragment>
                <h2>Utjevningsmandater</h2>
                <ReactTable />
            </React.Fragment>
        );
    }
}
