import * as React from "react";
import { PresentationType } from "../../Presentation/presentation-models";
import { selectionLookup } from "./presentation-selection-utilities";
import { TooltipInfoRight } from "../../../common";

const WIKIURL = process.env.WIKI;

export interface PresentationSelectionProps {
    changeSelection?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    currentSelection?: PresentationType;
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

    selectTooltipContent(table: string | undefined) {
        switch (table) {
            case "TABLE_ELECTION_OVERVIEW": {
                return {
                    text: "Her kan du se valgresultatet på landsbasis. Trykk på meg for mer informasjon!",
                    url: "#Landsoversikt"
                };
            }
            case "TABLE_DISTRICT_OVERVIEW": {
                return {
                    text: "Her kan du se valgresultatet for hvert fylke.",
                    url: "#Fylkesoversikt"
                };
            }
            case "TABLE_LEVELLING_SEATS_OVERVIEW": {
                return {
                    text: "Her kan du se fra hvilke fylker partiene har fått utjevningsmandater fra.",
                    url: "#Utjevningsmandater."
                };
            }
            case "TABLE_REMAINDER_QUOTIENTS": {
                return {
                    text: "Her ser du en oversikt over restkvotienter.",
                    url: "#Restkvotienter"
                };
            }
            case "SEAT_DISTRIBUTION": {
                return {
                    text: "Her ser du fordelingen av mandater på hvert fylke.",
                    url: "#Fylkesfordeling%20av%20mandater"
                };
            }
            case "TABLE_SINGLE_COUNTY": {
                return {
                    text: "Her kan du velge fylke og se en fullstendig oversikt for valgt fylke.",
                    url: "#Enkeltfylke"
                };
            }
            default: {
                return {
                    text: "Trykk på ikonet for å lese om oversikten.",
                    url: "#Visning"
                };
            }
        }
    }

    render() {
        const tooltipContent = this.selectTooltipContent(this.props.currentSelection);
        return (
            <div className="field">
                <label className="label">
                    <TooltipInfoRight
                        text={tooltipContent.text}
                        url={WIKIURL?.concat(tooltipContent.url)}
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
