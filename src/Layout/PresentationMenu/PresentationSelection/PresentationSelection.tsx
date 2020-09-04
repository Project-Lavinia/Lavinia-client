import * as React from "react";
import { PresentationType } from "../../Presentation/presentation-models";
import { selectionLookup } from "./presentation-selection-utilities";
import { checkExhaustively } from "../../../utilities";
import { TooltipInfo, TooltipDirection } from "../../../common";

const WIKIURL = process.env.WIKI;

export interface PresentationSelectionProps {
    changeSelection?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    currentSelection: PresentationType;
}

export class PresentationSelection extends React.Component<PresentationSelectionProps> {
    static defaultProps: PresentationSelectionProps = {
        currentSelection: PresentationType.ElectionTable,
    };
    constructor(props: PresentationSelectionProps) {
        super(props);
    }

    getSelectionOptions = () => {
        return selectionLookup.map((item) => {
            return (
                <option key={item.type} value={item.type}>
                    {item.displayName}
                </option>
            );
        });
    };

    selectTooltipContent(table: PresentationType) {
        switch (table) {
            case PresentationType.ElectionTable: {
                return {
                    text: "Her ser du valgresultatet på landsbasis.",
                    url: "#Landsoversikt"
                };
            }
            case PresentationType.DistrictTable: {
                return {
                    text: "Her ser du resultatet for hvert fylke.",
                    url: "#Fylkesoversikt"
                };
            }
            case PresentationType.LevellingSeats: {
                return {
                    text: "Her ser du fra hvilke fylker partiene har fått utjevningsmandater fra.",
                    url: "#Utjevningsmandater."
                };
            }
            case PresentationType.RemainderQuotients: {
                return {
                    text: "Her ser du en oversikt over restkvotienter.",
                    url: "#Restkvotienter"
                };
            }
            case PresentationType.SeatDistribution: {
                return {
                    text: "Her ser du fordelingen av mandater på hvert fylke.",
                    url: "#Fylkesfordeling%20av%20mandater"
                };
            }
            case PresentationType.SingleDistrict: {
                return {
                    text: "Her kan du velge fylke og se partienes valgresultat for valgt fylke.",
                    url: "#Enkeltfylke"
                };
            }
            default: {
                return checkExhaustively(table);
            }
        }
    }

    render() {
        const tooltipContent = this.selectTooltipContent(this.props.currentSelection);
        return (
            <div className="field">
                <label className="label">
                    <TooltipInfo
                        text={"Trykk på dette ikonet for å lese om oversikten."}
                        url={WIKIURL + tooltipContent.url}
                        direction={TooltipDirection.RIGHT}
                    />
                </label>
                <div className="control">
                    <div className="select is-primary is-fullwidth is-medium">
                        <select
                            onChange={this.props.changeSelection}
                            value={this.props.currentSelection}
                            id={"presentation_select"}
                        >
                            {this.getSelectionOptions()}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
