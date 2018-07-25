import * as React from "react";
import { SmartNumericInput } from "../SmartNumericInput";
import { LagueDhontResult } from "../Interfaces/Results";
import { PresentationType } from "../Types/PresentationType";

export interface PresentationSettingsProps {
    currentPresentation: PresentationType;
    displayedDecimals?: number;
    decimals: string;
    showPartiesWithoutSeats: boolean;
    changeDecimals: (decimals: string, decimalsNumber: number) => void;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
    results: LagueDhontResult;
}
export class PresentationSettings extends React.Component<PresentationSettingsProps> {
    static defaultProps = {} as PresentationSettingsProps;
    onChange() {
        // TODO: Complete function
    }
    /**
     * Helper function for reducing code in render(), allows conditional
     * rendering.
     */
    needsDecimals(): boolean {
        if (
            this.props.currentPresentation === PresentationType.DistrictTable ||
            this.props.currentPresentation === PresentationType.ElectionTable
        ) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <React.Fragment>
                <h2>Presentasjonsinnstillinger</h2>
                <form>
                    <div className="form-group mb-3">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="no-seats-setting"
                                checked={this.props.showPartiesWithoutSeats}
                                onChange={this.props.toggleShowPartiesWithoutSeats}
                            />
                            <label className="form-check-label" htmlFor="no-seats-setting">
                                Vis partier uten mandater
                            </label>
                        </div>
                    </div>
                    <SmartNumericInput
                        hidden={!this.needsDecimals()}
                        name="decimalPlaces"
                        defaultValue={2}
                        min={0}
                        max={16}
                        integer={true}
                        slider={true}
                        title="Antall desimaler"
                        value={this.props.decimals}
                        onChange={this.props.changeDecimals}
                    />
                </form>
            </React.Fragment>
        );
    }
}
