import * as React from "react";
import { PresentationType } from "../../Presentation/presentation-models";
import { selectionLookup } from "./presentation-selection-utilities";
import { TooltipInfoRight } from "../../../common";

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
                <TooltipInfoRight
                    text={"Trykk på dette ikonet for å lese om oversikten."}
                    url={"https://project-lavinia.github.io/#Visning"}
                />
                </label>
                <div className="control">
                    <div className="select is-dark is-fullwidth is-medium">
                        <select onChange={this.props.changeSelection} value={this.props.currentSelection}>
                            {this.getSelectionOptions()}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
