import * as React from "react";
import { LagueDhontResult } from "../../../computation";
import { SmartNumericInput } from "../../../common";
import { PresentationType, DisproportionalityIndex } from "../../Presentation/presentation-models";
import { Disproportionality } from "./Disproportionality";

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
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disproportionalityIndex: DisproportionalityIndex;
}
export class PresentationSettingsMenu extends React.Component<PresentationSettingsProps> {
    /**
     * Helper function for reducing code in render(), allows conditional
     * rendering.
     *
     * @returns true if the view requires decimals, false otherwise
     */
    needsDecimals(): boolean {
        return (
            this.props.currentPresentation === PresentationType.DistrictTable ||
            this.props.currentPresentation === PresentationType.ElectionTable ||
            this.props.currentPresentation === PresentationType.SingleDistrict ||
            this.props.currentPresentation === PresentationType.RemainderQuotients
        );
    }

    /**
     * Helper function that checks whether the current component should
     * show disproportionality index as an option
     *
     * @returns true if the current view requires displaying disproportionality options, false otherwise
     */
    showsDisproportionality(): boolean {
        return (
            this.props.currentPresentation === PresentationType.SingleDistrict ||
            this.props.currentPresentation === PresentationType.ElectionTable
        );
    }

    /**
     * Helper function for evaluating whether the district dropdown should
     * be shown.
     *
     * @returns true if the dropdown should be shown, false otherwise
     */
    needsDistrictDropdown(): boolean {
        if (this.props.currentPresentation === PresentationType.SingleDistrict) {
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
                    <Disproportionality
                        hidden={!this.showsDisproportionality()}
                        changeDisproportionalityIndex={this.props.changeDisproportionalityIndex}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                    />
                </form>
            </React.Fragment>
        );
    }
}
