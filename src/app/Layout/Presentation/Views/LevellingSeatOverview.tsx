import * as React from "react";
import { LevelingSeat } from "../../Interfaces/Results";
import ReactTable from "react-table";

interface LevellingSeatOverviewProps {
    decimals: number;
    levellingSeatQuotients: LevelingSeat[];
}

export class LevellingSeatOverview extends React.Component<LevellingSeatOverviewProps> {
    makeData() {
        return [];
    }
    getColumns(data: any) {
        return [];
    }
    render() {
        const data = this.makeData();
        const columns = this.getColumns(data);
        return (
            <React.Fragment>
                <h3>Utjevningsmandater</h3>
                <ReactTable data={data} columns={columns} />
            </React.Fragment>
        );
    }
}
