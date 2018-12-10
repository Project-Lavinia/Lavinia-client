import * as React from "react";
import { LagueDhontResult } from "../../../computation";
import { SmartNumericInput } from "../../../common";
import { PresentationType, DisproportionalityIndex } from "../../Presentation/presentation-models";
import { DistrictSelect } from "./DistrictSelect";
import { DisproportionalitySelect } from "./DisproportionalitySelect";
import { NoSeatsCheckbox } from "./NoSeatsCheckbox";
import { ComparisonCheckbox } from "./ComparisonCheckbox";

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
    toggleShowComparison: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showComparison: boolean;
}
export class PresentationSettingsMenu extends React.Component<PresentationSettingsProps> {
    /**
     * Helper function for reducing code in render(), allows conditional
     * rendering.
     *
     * @returns true if the view contains decimals, false otherwise
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
    showDisproportionalitySelect(): boolean {
        return (
            this.props.currentPresentation === PresentationType.SingleDistrict ||
            this.props.currentPresentation === PresentationType.ElectionTable
        );
    }

    /**
     * Helper function for evaluating whether the district select should
     * be shown.
     *
     * @returns true if the dropdown should be shown, false otherwise
     */
    showDistrictSelect(): boolean {
        if (this.props.currentPresentation === PresentationType.SingleDistrict) {
            return true;
        }
        return false;
    }

    /**
     * Helper function for evaluating whether comparison should be shown.
     *
     * @returns true if comparison should be shown, false otherwise
     */
    showComparison(): boolean {
        return this.props.currentPresentation === PresentationType.ElectionTable;
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="pt-3">Presentasjonsinnstillinger</h2>
                <form>
                    <NoSeatsCheckbox
                        showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                        toggleShowPartiesWithoutSeats={this.props.toggleShowPartiesWithoutSeats}
                    />
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
                    <DistrictSelect
                        hidden={!this.showDistrictSelect()}
                        districtResults={this.props.results.districtResults}
                        selectDistrict={this.props.selectDistrict}
                        districtSelected={this.props.districtSelected}
                    />
                    <DisproportionalitySelect
                        hidden={!this.showDisproportionalitySelect()}
                        changeDisproportionalityIndex={this.props.changeDisproportionalityIndex}
                        disproportionalityIndex={this.props.disproportionalityIndex}
                    />
                    <ComparisonCheckbox
                        hidden={!this.showComparison()}
                        showComparison={this.props.showComparison}
                        toggleComparison={this.props.toggleShowComparison}
                    />
                </form>
            </React.Fragment>
        );
    }
}
