import { PartyResult } from "../../../computation/computation-models";
import * as React from "react";
import ReactTable from "react-table";
import { norwegian } from "../../../utilities/rt";

export interface ElectionComparisonProps {
    comparisonPartyResults: PartyResult[];
    currentPartyResults: PartyResult[];
}

interface Comparison
    extends Pick<PartyResult, "partyCode" | "districtSeats" | "levelingSeats" | "totalSeats" | "proportionality"> {
    districtSeatsComparison: number;
    districtSeatsDifference: number;
    levelingSeatsComparison: number;
    levelingSeatsDifference: number;
    totalSeatsDifference: number;
    totalSeatsComparison: number;
    proportionalityComparison: number;
    proportionalityDifference: number;
}

export class ElectionComparison extends React.Component<ElectionComparisonProps> {
    /**
     * Helper method to generate the data object necessary for comparison.
     * Needs to filter which parties still exist and match them to the parties
     * in the original.
     *
     * @param partyResults - the current results
     * @param comparedPartyResults - results to compare the current to
     */
    getData = (partyResults: PartyResult[], comparedPartyResults: PartyResult[]): Comparison[] => {
        /**
         * Iterate through the current results and find a match by party code
         * for the compared, and add a comparison.
         */
        const comparisons: (Comparison | undefined)[] = partyResults.map((current) => {
            const comparable = comparedPartyResults.find((comparison) => current.partyCode === comparison.partyCode);
            if (!!comparable) {
                const comparison: Comparison = {
                    partyCode: current.partyCode,
                    districtSeats: current.districtSeats,
                    districtSeatsComparison: comparable.districtSeats,
                    districtSeatsDifference: current.districtSeats - comparable.districtSeats,
                    levelingSeats: current.levelingSeats,
                    levelingSeatsComparison: comparable.levelingSeats,
                    levelingSeatsDifference: current.levelingSeats - comparable.levelingSeats,
                    totalSeats: current.totalSeats,
                    totalSeatsComparison: comparable.totalSeats,
                    totalSeatsDifference: current.totalSeats - comparable.totalSeats,
                    proportionality: current.proportionality,
                    proportionalityComparison: comparable.proportionality,
                    proportionalityDifference: current.proportionality - comparable.proportionality,
                };
                return comparison;
            } else {
                return undefined;
            }
        });
        /**
         * Filtered to remove the undefined map-results, and cast due to
         * constraints with typing. After the filtering there is no way
         * there are any undefined comparisons remaining, but the type
         * system does not pick up on it.
         */
        const filtered = comparisons.filter((comparison) => comparison !== undefined) as Comparison[];
        return filtered;
    };

    render() {
        const data = this.getData(this.props.currentPartyResults, this.props.comparisonPartyResults);
        return (
            <ReactTable
                className="-highlight -striped has-text-centered"
                data={data}
                pageSize={data.length > 10 ? 10 : data.length}
                columns={[
                    {
                        id: "partyCode",
                        Header: <abbr title="Partikode">P</abbr>,
                        accessor: (d: Comparison) => d.partyCode,
                    },
                    {
                        id: "totalDifference",
                        Header: <abbr title="Differanse av total sum mandater">Total endring</abbr>,
                        accessor: (d: Comparison) => d.totalSeatsDifference,
                    },
                    {
                        id: "districtDifference",
                        Header: <abbr title="Differanse av distriktsmandater">Endring distrikt</abbr>,
                        accessor: (d: Comparison) => d.districtSeatsDifference,
                    },
                    {
                        id: "levelingDifference",
                        Header: <abbr title="Differanse av utjevningsmandater">Endring utjevning</abbr>,
                        accessor: (d: Comparison) => d.levelingSeatsDifference,
                    },
                ]}
                showPagination={data.length > 10}
                showPageSizeOptions={false}
                {...norwegian}
            />
        );
    }
}
