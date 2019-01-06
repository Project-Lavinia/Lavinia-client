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
}

export class ElectionOverview extends React.Component<ElectionOverviewProps, {}> {
    render() {
        const data = this.props.partyResults;
        const proportionalities = data.map((value) => value.proportionality);
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
