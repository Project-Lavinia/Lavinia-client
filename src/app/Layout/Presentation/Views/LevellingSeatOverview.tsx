import * as React from "react";
import { LevelingSeat } from "../../Interfaces/Results";
import ReactTable from "react-table";

interface LevellingSeatOverviewProps {
    decimals: number;
    levellingSeatQuotients: LevelingSeat[];
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
