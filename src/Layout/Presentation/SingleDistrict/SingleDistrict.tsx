import * as React from "react";
import ReactTable from "react-table";
import { DistrictResult, PartyResult } from "../../../computation/computation-models";
import { toSum } from "../../../utilities/reduce";
import { DisproportionalityIndex } from "../presentation-models";

export interface SingleDistrictProps {
    districtResults: DistrictResult[];
    districtSelected: string;
    decimals: number;
    disproportionalityIndex: DisproportionalityIndex;
}

export class SingleDistrict extends React.Component<SingleDistrictProps, {}> {
    getData(): PartyResult[] {
        return this.props.districtResults.find((district) => district.name === this.props.districtSelected)!
            .partyResults;
    }

    render() {
        const data = this.getData();
        const decimals = this.props.decimals;
        const proportionalities = data.map((value) => value.proportionality);
        let label: string;
        let index: number;
        switch (this.props.disproportionalityIndex) {
            case DisproportionalityIndex.LOOSEMORE_HANBY: {
                label = "LHI";
                index = proportionalities.map((value) => Math.abs(value)).reduce(toSum, 0) / 2;
                break;
            }
            case DisproportionalityIndex.GALLAGHER: {
                label = "GI";
                index = Math.sqrt(proportionalities.map((value) => value * value).reduce(toSum, 0) / 2);
                break;
            }
            default: {
                label = "Error";
                index = -1;
            }
        }
        return (
            <React.Fragment>
                <h1 className="h1">{this.props.districtSelected}</h1>
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
                            )
                        },
                        {
                            Header: "Stemmer",
                            accessor: "votes",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.votes).reduce(toSum)}</strong>
                                </span>
                            )
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
                                    )
                                },
                                {
                                    Header: "Utjevning",
                                    accessor: "levelingSeats",
                                    Footer: (
                                        <span>
                                            <strong>{data.map((value) => value.levelingSeats).reduce(toSum)}</strong>
                                        </span>
                                    )
                                }
                            ]
                        },
                        {
                            Header: "Mandater",
                            accessor: "totalSeats",
                            Footer: (
                                <span>
                                    <strong>{data.map((value) => value.totalSeats).reduce(toSum)}</strong>
                                </span>
                            )
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
                            )
                        }
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
}
