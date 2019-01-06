import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../../computation";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import { roundNumber } from "../../../utilities/number";

export interface ElectionOverviewProps {
    partyResults: PartyResult[];
    comparisonPartyResults: PartyResult[];
    decimals: number;
    threshold: number;
    partyNameWidth: number;
    disproportionalityIndex: DisproportionalityIndex;
    showPartiesWithoutSeats: boolean;
}

interface ElectionOverviewDatum extends PartyResult {
    totalSeatDifference: number;
}

export class ElectionOverview extends React.Component<ElectionOverviewProps, {}> {
    makeData = (): ElectionOverviewDatum[] => {
        const data: ElectionOverviewDatum[] = [];
        const currents = this.props.partyResults;
        const comparisons = this.props.comparisonPartyResults;
        // Sanity check
        for (let i = 0; i < currents.length; i++) {
            const difference = currents[i].totalSeats - comparisons[i].totalSeats;
            const datum: ElectionOverviewDatum = {
                ...this.props.partyResults[i],
                totalSeatDifference: difference,
            };
            data.push(datum);
        }
        if (!this.props.showPartiesWithoutSeats) {
            return data.filter((datum) => datum.totalSeats > 0 || datum.totalSeatDifference !== 0);
        }
        return data;
    };
    
    /**
     * Utility for checking whether the difference column should be displayed,
     * ie -- are there any differences?
     *
     * @param data the data, required to figure out if there is a difference.
     * @returns true if there is a difference, else false.
     */
    shouldShowDifference = (data: ElectionOverviewDatum[]) => {
        return data.some((datum) => datum.totalSeatDifference !== 0);
    };

    render() {
        const data = this.makeData();
        const proportionalities = this.props.showPartiesWithoutSeats
            ? data.map((value) => value.proportionality)
            : data.filter((datum) => datum.totalSeats > 0).map((value) => value.proportionality);
        const decimals = this.props.decimals;
        let index: number;
        let label: string;
        const LSq = Math.sqrt(proportionalities.map((value) => value * value).reduce(toSum, 0) / 2);
        const LH = proportionalities.map((value) => Math.abs(value)).reduce(toSum, 0) / 2;
        switch (this.props.disproportionalityIndex) {
            case DisproportionalityIndex.LOOSEMORE_HANBY: {
                label = "L-H";
                index = LH;
                break;
            }
            case DisproportionalityIndex.GALLAGHER: {
                label = "LSq";
                index = LSq;
                break;
            }
            default: {
                checkExhaustively(this.props.disproportionalityIndex);
                label = "Error";
                index = -1;
            }
        }

        return (
            <ReactTable
                className="-highlight -striped"
                data={data}
                defaultPageSize={data.length >= 10 ? 10 : data.length}
                pageSize={data.length >= 10 ? 10 : data.length}
                showPagination={data.length > 10}
                showPageSizeOptions={false}
                ofText={"/"}
                nextText={"→"}
                previousText={"←"}
                pageText={"#"}
                columns={[
                    {
                        Header: "Parti",
                        accessor: "partyName",
                        width: this.props.partyNameWidth + 165,
                        Footer: <strong>Utvalg</strong>,
                    },
                    {
                        Header: "%",
                        id: "%",
                        accessor: (d: ElectionOverviewDatum) => roundNumber(d.percentVotes, decimals),
                    },
                    {
                        Header: "Stemmer",
                        accessor: "votes",
                        Footer: <strong>{data.map((value) => value.votes).reduce(toSum, 0)}</strong>,
                    },
                    {
                        Header: "Distrikt",
                        accessor: "districtSeats",
                        Footer: <strong>{data.map((value) => value.districtSeats).reduce(toSum, 0)}</strong>,
                    },
                    {
                        Header: "Utjevning",
                        accessor: "levelingSeats",
                        Footer: <strong>{data.map((value) => value.levelingSeats).reduce(toSum, 0)}</strong>,
                    },
                    {
                        Header: "Sum",
                        accessor: "totalSeats",
                        Footer: <strong>{data.map((value) => value.totalSeats).reduce(toSum, 0)}</strong>,
                    },
                    {
                        Header: "Differanse",
                        accessor: "totalSeatDifference",
                        show: this.shouldShowDifference(data),
                    },
                    {
                        Header: "Prop.",
                        id: "proportionality",
                        accessor: (d: ElectionOverviewDatum) => roundNumber(d.proportionality, decimals),
                        Footer: (
                            <strong>
                                {label}: {index.toFixed(this.props.decimals)}
                            </strong>
                        ),
                    },
                ]}
                defaultSorted={[
                    {
                        id: "totalSeats",
                        desc: true,
                    },
                ]}
            />
        );
    }
}
