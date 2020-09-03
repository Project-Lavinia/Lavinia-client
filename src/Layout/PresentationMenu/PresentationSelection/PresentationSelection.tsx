import * as React from "react";
import { PresentationType } from "../../Presentation/presentation-models";
import { selectionLookup } from "./presentation-selection-utilities";
import { TooltipInfo, TooltipDirection } from "../../../common";

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

    render() {
        return (
            <div className="field">
                <label className="label">
                    <TooltipInfo
                        text={"Trykk på dette ikonet for å lese om oversikten."}
                        url={WIKIURL + "#Visning"}
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
