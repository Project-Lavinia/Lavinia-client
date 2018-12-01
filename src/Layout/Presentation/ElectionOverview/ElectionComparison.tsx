import { LagueDhontResult } from "../../../computation/computation-models";
import * as React from "react";
import ReactTable from "react-table";

export interface ElectionComparisonProps {
    comparisonPartyResults: LagueDhontResult;
    currentPartyResults: LagueDhontResult;
}

export class ElectionComparison extends React.Component<ElectionComparisonProps> {
    /**
     * Helper method to generate the data object necessary for comparison.
     *
     * @param partyResults - the current results
     * @param comparedPartyResults - results to compare the current to
     */
    getData = () => {
        return {
            current: this.props.currentPartyResults,
            comparison: this.props.comparisonPartyResults,
        };
    };

    render() {
        return <ReactTable />;
    }
}
