import * as React from "react";
import { DistrictResult, LevelingSeat } from "../../Interfaces/Results";
import ReactTable, { Column } from "react-table";

/**
 * Data here is represented as a simplified DistrictResult. For representing
 * this data we need a district (because each row is essentially keyed by
 * district), and then we need to ensure each district has a value for quotient
 * and "wonLevellingSeat" for non-participating parties
 */
interface SimpleDistrictResult {
    /**
     * The district, the key of the row
     */
    district: string;
    levellingSeatRounds: LevellingSeatRound[];
}

interface LevellingSeatRound {
    partyCode: string;
    quotient: number;
    wonLevellingSeat: boolean;
}

export interface RemainderQuotientsProps {
    districtResults: DistrictResult[];
    levellingSeats: LevelingSeat[];
    decimals: number;
    showPartiesWithoutSeats: boolean;
}

/**
 * Iterates through districtResults to flatten and filter it into a more
 * table-friendly form specific to RemainderQuotients
 *
 * @param districtResults results of a computation having been run on an
 * election
 * @returns an array of data representing the last remainder from a Sainte-Lagüe
 * or D'Hondt calculation in a given district for a given party, and whether or
 * not they won a levelling seat in that district-party
 */

export class RemainderQuotients extends React.Component<RemainderQuotientsProps> {
    makeData(): SimpleDistrictResult[] {
        const data: SimpleDistrictResult[] = [];
        const wonSeat: Set<string> = new Set();
        const modified = this.props.districtResults;
        if (!this.props.showPartiesWithoutSeats) {
            modified.forEach((result) => {
                result.partyResults.filter((result) => result.totalSeats > 0).forEach((result) => {
                    wonSeat.add(result.partyCode);
                });
            });
        }
        this.props.districtResults.forEach((result) => {
            const current: any = {};
            current.district = result.name;
            current.levellingSeatRounds = [];
            const lastIndex = result.districtSeatResult.length - 1;

            result.districtSeatResult[lastIndex].partyResults.forEach((result) => {
                current.levellingSeatRounds.push({
                    partyCode: result.partyCode,
                    quotient: result.quotient,
                    wonLevellingSeat: false
                });
            });
            const typedCurrent: SimpleDistrictResult = current;
            if (!this.props.showPartiesWithoutSeats) {
                typedCurrent.levellingSeatRounds = typedCurrent.levellingSeatRounds.filter((result) =>
                    wonSeat.has(result.partyCode)
                );
            }
            data.push(typedCurrent);
        });

        /**
         * Cross reference with levelling seats to get highlighted cells
         */
        this.props.levellingSeats.forEach((seat) => {
            const districtIndex = data.findIndex((entry) => entry.district === seat.district);
            const partyIndex = data[districtIndex].levellingSeatRounds.findIndex(
                (result) => result.partyCode === seat.partyCode
            );
            data[districtIndex].levellingSeatRounds[partyIndex].wonLevellingSeat = true;
        });

        return data;
    }

    getColumns(): Column[] {
        const data = this.makeData();
        const columns: Column[] = [];

        for (let i = 0; i < data[0].levellingSeatRounds.length; i++) {
            const element = data[0].levellingSeatRounds[i];
            columns.push({
                Header: element.partyCode,
                accessor: `levellingSeatRounds[${i}]`,
                Cell: (row) => {
                    if (row.value !== undefined) {
                        return (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: row.value.wonLevellingSeat ? "white" : "black",
                                    backgroundColor: row.value.wonLevellingSeat ? "#ff6e00" : "white"
                                }}
                            >
                                {Number(row.value.quotient / 10000).toFixed(this.props.decimals)}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                {(0).toFixed(this.props.decimals)}
                            </div>
                        );
                    }
                },
                sortable: false
            });
        }
        columns.sort((a: Column, b: Column) => {
            if (typeof a.Header === "string" && typeof b.Header === "string") {
                return a.Header.localeCompare(b.Header);
            } else {
                return 0;
            }
        });
        columns.unshift({
            Header: "Fylker",
            accessor: "district"
        });

        return columns;
    }
    render() {
        const data = this.makeData();

        return (
            <React.Fragment>
                <h2>{"Restkvotienter"}</h2>
                <p style={{ textAlign: "justify" }}>
                    {
                        "Par på formen fylke-parti med oransje celler indikerer at partiet har vunnet et utjevningsmandat i det korresponderende fylket. Kvotientene er delt på 10 000 og representerer verdien ved utdeling av siste distriktsmandat i fylket for det respektive partiet."
                    }
                </p>
                <ReactTable
                    data={data}
                    columns={this.getColumns()}
                    defaultPageSize={10}
                    showPageSizeOptions={false}
                    ofText={"/"}
                    nextText={"→"}
                    previousText={"←"}
                    pageText={"#"}
                />
            </React.Fragment>
        );
    }
}