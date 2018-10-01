import * as React from "react";
import { SmartNumericInput } from "../SmartNumericInput";
import { LagueDhontResult } from "../Interfaces/Results";
import { PresentationType } from "../Types/PresentationType";

export interface PresentationSettingsProps {
    currentPresentation: PresentationType;
    districtSelected: string;
    displayedDecimals?: number;
    decimals: string;
    showPartiesWithoutSeats: boolean;
    changeDecimals: (decimals: string, decimalsNumber: number) => void;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    results: LagueDhontResult;
}
export class PresentationSettings extends React.Component<PresentationSettingsProps> {
    /**
     * Helper function for reducing code in render(), allows conditional
     * rendering.
     */
    needsDecimals(): boolean {
        if (
            this.props.currentPresentation === PresentationType.DistrictTable ||
            this.props.currentPresentation === PresentationType.ElectionTable ||
            this.props.currentPresentation === PresentationType.SingleCountyTable ||
            this.props.currentPresentation === PresentationType.RemainderQuotients
        ) {
            return true;
        }
        return false;
    }

    /**
     * Helper function for evaluating whether the district dropdown should
     * be shown.
     *
     * @returns true if the dropdown should be shown, false otherwise
     * @memberof PresentationSettings
     */
    needsDistrictDropdown(): boolean {
        if (this.props.currentPresentation === PresentationType.SingleCountyTable) {
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
                    <div hidden={!this.needsDistrictDropdown()} className="form-row align-items-center">
                        <div className="col-sm-4 my-1">
                            <label className="col-form-label col-md-2" htmlFor="district">
                                Fylke
                            </label>
                        </div>
                        <div className="col-sm-8">
                            <select
                                id="district"
                                onChange={this.props.selectDistrict}
                                className="form-control"
                                value={this.props.districtSelected}
                            >
                                {this.props.results.districtResults.map((item, index) => {
                                    return (
                                        <option key={index} value={item.name}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}
