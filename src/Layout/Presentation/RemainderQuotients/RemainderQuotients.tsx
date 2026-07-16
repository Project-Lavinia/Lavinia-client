import * as React from "react";
import ReactTable, { Column } from "react-table";
import { LevelingSeat, DistrictResult, DistrictQuotients, PartyQuotient, AlgorithmType } from "../../../computation";
import { norwegian } from "../../../utilities/rt";
import { isQuotientAlgorithm } from "../../../computation/logic";
import { numberFormat } from "../../../utilities/customNumberFormat";

export interface RemainderQuotientsProps {
    districtResults: DistrictResult[];
    levellingSeats: LevelingSeat[];
    finalQuotients: DistrictQuotients[];
    year: number;
    decimals: number;
    showPartiesWithoutSeats: boolean;
    algorithm: AlgorithmType;
    partyMap: _.Dictionary<string>;
}

/**
 * Iterates through districtResults to flatten and filter it into a more
 * table-friendly form specific to RemainderQuotients
 *
 * @param districtResults results of a computation having been run on an
 * election
 * @returns an array of data representing the last remainder from a Sainte-Laguë,
 * D'Hondt, Largest fraction (Hare) or Largest fraction (Droop) calculation in a given district for a given party,
 * and whether or not they won a levelling seat in that district-party
 */
export class RemainderQuotients extends React.Component<RemainderQuotientsProps> {
    makeData(): DistrictQuotients[] {
        const wonSeat: Set<string> = new Set();
        const modified = this.props.districtResults;
        let modifiedQuotients: DistrictQuotients[] = [];
        if (!this.props.showPartiesWithoutSeats) {
            modified.forEach((result) => {
                result.partyResults
                    .filter((result) => result.totalSeats > 0)
                    .forEach((result) => {
                        wonSeat.add(result.partyCode);
                    });
            });

            this.props.finalQuotients.forEach((district) => {
                const districtQuotients: DistrictQuotients = {
                    district: district.district,
                    levellingSeatRounds: district.levellingSeatRounds.filter((party) => wonSeat.has(party.partyCode)),
                };
                modifiedQuotients.push(districtQuotients);
            });
        } else {
            modifiedQuotients = this.props.finalQuotients;
        }

        // Build a canonical party order from the union of all districts so that
        // local parties (e.g. PASF in Finnmark only) are not silently dropped when
        // district 0 (Akershus) doesn't include them.
        const seenCodes = new Set<string>();
        const canonicalOrder: string[] = [];
        for (const district of modifiedQuotients) {
            for (const pq of district.levellingSeatRounds) {
                if (!seenCodes.has(pq.partyCode)) {
                    seenCodes.add(pq.partyCode);
                    canonicalOrder.push(pq.partyCode);
                }
            }
        }

        return modifiedQuotients.map((district) => {
            const byCode = new Map<string, PartyQuotient>(
                district.levellingSeatRounds.map((pq) => [pq.partyCode, pq])
            );
            const padded: PartyQuotient[] = canonicalOrder.map(
                (code) => byCode.get(code) ?? { partyCode: code, quotient: 0, wonLevellingSeat: false }
            );
            return { district: district.district, levellingSeatRounds: padded };
        });
    }

    getColumns(): Column[] {
        const partyMap = this.props.partyMap;
        const data = this.makeData();
        const columns: Column[] = [];
        for (let i = 0; i < data[0].levellingSeatRounds.length; i++) {
            const element = data[0].levellingSeatRounds[i];
            columns.push({
                Header: () => {
                    return <abbr title={partyMap[element.partyCode]}>{element.partyCode}</abbr>;
                },
                accessor: `levellingSeatRounds[${i}]`,
                minWidth: 80,
                Cell: (row) => {
                    if (row.value !== undefined) {
                        let quotient = row.value.quotient;
                        const useAdjustedQuotient = this.props.year >= 2005;
                        if (useAdjustedQuotient && isQuotientAlgorithm(this.props.algorithm)) {
                            quotient = quotient * 10000;
                        } else if (isQuotientAlgorithm(this.props.algorithm)) {
                            quotient = quotient / 10000;
                        }
                        return (
                            <div
                                className={row.value.wonLevellingSeat ? "has-background-dark has-text-white" : ""}
                            >
                                {numberFormat(Number(quotient), this.props.decimals)}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                {(0).toFixed(this.props.decimals)}
                            </div>
                        );
                    }
                },
                sortable: false,
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
            Header: <span className="is-pulled-left"> {"Fylker"}</span> ,
            accessor: "district",
            Cell: (row) => {
                return <span className="is-pulled-left">{row.value}</span>;
            },
        });

        return columns;
    }

    getAdjustment(year: number, algorithm: AlgorithmType) {
        const ending =
            "og representerer verdien ved utdeling av siste distriktsmandat i fylket for det respektive partiet.";
        const useAdjustedQuotient = year >= 2005;
        if (useAdjustedQuotient && isQuotientAlgorithm(algorithm)) {
            return " er ganget med 10 000 " + ending;
        } else if (isQuotientAlgorithm(algorithm)) {
            return " er delt på 10 000 " + ending;
        }

        return " er fordelingstallet som tilsier hvor mange distriktsmandater partiet skal vinne i det respektive fylket.";
    }

    render() {
        const data = this.makeData();

        return (
            <React.Fragment>
                <div className="card has-background-primary has-text-light is-size-5">
                    <p className="card-content">
                        Markerte celler indikerer at partiet har vunnet et utjevningsmandat i det korresponderende
                        fylket. Kvotientene
                        {this.getAdjustment(this.props.year, this.props.algorithm)}
                    </p>
                </div>

                <ReactTable
                    className="-highlight -striped has-text-centered"
                    data={data}
                    columns={this.getColumns()}
                    defaultPageSize={10}
                    showPageSizeOptions={false}
                    {...norwegian}
                />
            </React.Fragment>
        );
    }
}
