import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, PartyResult, SeatResult } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";
import { checkExhaustively } from "../../../utilities";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
}

export class SingleDistrict extends React.Component<SingleDistrictProps, {}> {
    getDistrictResult = (name: string): DistrictResult | undefined => {
        return this.props.districtResults.find((district) => district.name === name);
    };
    getData = (): PartyResult[] | undefined => {
        const districtResult = this.getDistrictResult(this.props.districtSelected);
        return districtResult ? districtResult.partyResults : undefined;
    };

    render() {
        const data = this.getData()!;
        const decimals = this.props.decimals;
        const proportionalities = data.map((value) => value.proportionality);
        const lastSeat = this.getLastSeat();
        const lastSeatByQuotient = lastSeat!.partyResults.sort((a, b) => (a.quotient <= b.quotient ? 1 : -1));
        const winner = lastSeatByQuotient[0];
        const runnerUp = lastSeatByQuotient[1];
        const moreVotesToWin = (winner.quotient * runnerUp.denominator - runnerUp.votes - 1).toFixed(0);
        console.log(runnerUp);
        let label: string;
        let index: number;
        switch (this.props.disproportionalityIndex) {
            case DisproportionalityIndex.LOOSEMORE_HANBY: {
                label = "L-H";
                index = proportionalities.map((value) => Math.abs(value)).reduce(toSum, 0) / 2;
                break;
            }
            case DisproportionalityIndex.GALLAGHER: {
                label = "LSq";
                index = Math.sqrt(proportionalities.map((value) => value * value).reduce(toSum, 0) / 2);
                break;
            }
            default: {
                checkExhaustively(this.props.disproportionalityIndex);
                label = "Error";
                index = -1;
            }
        }
        return (
            <React.Fragment>
                <h1 className="h1">{this.props.districtSelected}</h1>
                <p>
                    Sistemandat i {this.props.districtSelected} gikk til {winner.partyCode}. {runnerUp.partyCode}{" "}
                    trengte {moreVotesToWin} flere stemmer for å ta mandatet.
                </p>
                <ReactTable
                    className="-highlight -striped"
                    data={data}
                    pageSize={data.length <= 10 ? data.length : 10}
                    showPagination={data.length > 10}
                    columns={[
                        {
                            Header: "Parti",
                            accessor: "partyCode",
                            Footer: (
                                <span>
                                    <strong>Utvalg</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Stemmer",
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.votes).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Mandater",
                            accessor: "totalSeats",
                            columns: [
                                {
                                    Header: "Distrikt",
                                    accessor: "districtSeats",
                                    Footer: (
                                        <span>
                                            <strong>{data.map((value) => value.districtSeats).reduce(toSum)}</strong>
                                        </span>
                                    ),
                                },
                                {
                                    Header: "Utjevning",
                                    accessor: "levelingSeats",
                                    Footer: (
                                        <span>
                                            <strong>{data.map((value) => value.levelingSeats).reduce(toSum)}</strong>
                                        </span>
                                    ),
                                },
                            ],
                        },
                        {
                            Header: "Mandater",
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.totalSeats).reduce(toSum)}</strong>
                                </span>
                            ),
                        },
                        {
                            Header: "Prop.",
                            accessor: "proportionality",
                            Footer: (
                                <span>
                                    <strong>
                                        {label}: {index.toFixed(decimals)}
                                    </strong>
                                </span>
                            ),
                        },
                    ]}
                    showPageSizeOptions={false}
                    ofText={"/"}
                    nextText={"→"}
                    previousText={"←"}
                    pageText={"#"}
                />
            </React.Fragment>
        );
    }
    getLastSeat = (): SeatResult | undefined => {
        const districtResult = this.getDistrictResult(this.props.districtSelected);
        if (districtResult) {
            return districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
        }
        return undefined;
    };
}
