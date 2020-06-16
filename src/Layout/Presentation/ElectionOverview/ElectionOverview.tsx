import * as React from "react";
import ReactTable from "react-table";
import { PartyResult } from "../../../computation";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";
import { roundNumber } from "../../../utilities/number";
import {
    selectFilterWithOptions,
    thresholdFilterMethod,
    allGreaterThanEqualsMethod,
    positiveOrNegativeFilterMethod,
    caseInsensitiveFilterMethod,
    zeroNotZeroFilterMethod,
    norwegian,
} from "../../../utilities/rt";

export interface ElectionOverviewProps {
    partyResults: PartyResult[];
    comparisonPartyResults: PartyResult[];
    decimals: number;
    threshold: number;
    partyNameWidth: number;
    disproportionalityIndex: DisproportionalityIndex;
    showPartiesWithoutSeats: boolean;
    showFilters: boolean;
}

interface ElectionOverviewDatum extends PartyResult {
    totalSeatDifference: number;
}

export class ElectionOverview extends React.Component<ElectionOverviewProps, {}> {
    /**
     * Helper for making data. Creates a PartyResult with an additional field,
     * so that difference can be displayed based on the comparison.
     */
    makeData = (): ElectionOverviewDatum[] => {
        const data: ElectionOverviewDatum[] = [];
        const currents = this.props.partyResults;
        const comparisons = this.props.comparisonPartyResults;
        const shouldCalculateDifference = currents.length === comparisons.length;
        for (let i = 0; i < currents.length; i++) {
            const difference = shouldCalculateDifference ? currents[i].totalSeats - comparisons[i].totalSeats : 0;
            const datum: ElectionOverviewDatum = {
                ...this.props.partyResults[i],
                totalSeatDifference: difference,
            };
            data.push(datum);
        }

        // Ensures that parties that have rows or used to have rows are shown.
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

    /**
     * 
     * @param value the value to be formatted with ',' instead of '.' and space between thousands.
     */
    numberFormat(value:number){
        return new Intl.NumberFormat('nb-NO').format(value);
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
        const allTrueFalseOptions = [
            { value: "all", title: "Alle" },
            { value: "true", title: "> 0" },
            { value: "false", title: "= 0" },
        ];

        const thresholdOptions = [
            { value: "all", title: "Alle" },
            { value: "gteq", title: `≥ ${this.props.threshold}%` },
            { value: "lt", title: `< ${this.props.threshold}%` },
        ];

        const thresholdIsZeroOptions = [
            { value: "all", title: "Alle" },
            { value: "gteq", title: "≥ 0" },
            { value: "lt", title: "< 0" },
        ];

        return (
            <React.Fragment>
                <ReactTable
                    className="-highlight -striped has-text-right"
                    multiSort={false}
                    data={data}
                    filterable={this.props.showFilters}
                    showPagination={this.props.showFilters ? data.length > 8 : data.length > 10}
                    showPageSizeOptions={false}
                    pageSize={this.props.showFilters ? 8 : data.length > 10 ? 10 : data.length}
                    {...norwegian}
                    columns={[
                        {
                            Header: <span className="is-pulled-left"> {"Parti"}</span> ,
                            accessor: "partyCode",
                            filterMethod: caseInsensitiveFilterMethod,
                            Footer: <strong className="is-pulled-left">Utvalg</strong>,
                            Cell: (row) => {
                                return row.original.partyName ? (
                                    <span className="is-pulled-left" >{row.original.partyName}</span>
                                ) : (
                                    row.value
                                );
                            },
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Stemmer"}</span> ,
                            accessor: "votes",
                            filterable: false,
                            Cell: (row) => {
                                return row.value !== null ? this.numberFormat(row.value) : row.value
                            },
                            Footer: <strong>{this.numberFormat(data.map((value) => value.votes).reduce(toSum, 0))}</strong>,
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Oppsluting %"}</span> ,
                            id: "%",
                            Filter: selectFilterWithOptions(thresholdOptions),
                            filterMethod: thresholdFilterMethod(this.props.threshold),
                            accessor: (d: ElectionOverviewDatum) => roundNumber(d.percentVotes, decimals),
                            Cell: (row) => {
                                return row.value !== null ? this.numberFormat(row.value) : row.value
                            },
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Distrikt"}</span> ,
                            accessor: "districtSeats",
                            Filter: selectFilterWithOptions(allTrueFalseOptions),
                            filterMethod: allGreaterThanEqualsMethod,
                            Footer: <strong>{data.map((value) => value.districtSeats).reduce(toSum, 0)}</strong>,
                        },

                        {
                            Header: <span className="is-pulled-right"> {"Utjevning"}</span> ,
                            accessor: "levelingSeats",
                            Filter: selectFilterWithOptions(allTrueFalseOptions),
                            filterMethod: allGreaterThanEqualsMethod,
                            Footer: <strong>{data.map((value) => value.levelingSeats).reduce(toSum, 0)}</strong>,
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Sum"}</span> ,
                            accessor: "totalSeats",
                            filterable: false,
                            Footer: <strong>{data.map((value) => value.totalSeats).reduce(toSum, 0)}</strong>,
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Differanse"}</span> ,
                            accessor: "totalSeatDifference",
                            Filter: selectFilterWithOptions(allTrueFalseOptions),
                            filterMethod: zeroNotZeroFilterMethod,
                            show: this.shouldShowDifference(data),
                        },
                        {
                            Header: <span className="is-pulled-right"> {"Prop. %"}</span>, 
                            id: "proportionality",
                            accessor: (d: ElectionOverviewDatum) => roundNumber(d.proportionality, decimals),
                            Filter: selectFilterWithOptions(thresholdIsZeroOptions),
                            filterMethod: positiveOrNegativeFilterMethod(),
                            Cell: (row) => {
                                return row.value !== null ? this.numberFormat(row.value) : row.value
                            },
                            Footer: (
                                <strong>
                                    {label}: {this.numberFormat(roundNumber(index, decimals))}
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
            </React.Fragment>
        );
    }
}
