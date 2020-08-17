import * as React from "react";
import { LagueDhontResult, ComputationPayload } from "../../../computation";
import { SmartNumericInput, TooltipInfo } from "../../../common";
import { PresentationType, DisproportionalityIndex } from "../../Presentation/presentation-models";
import { DisproportionalitySelect } from "./DisproportionalitySelect";
import { NoSeatsCheckbox } from "./NoSeatsCheckbox";
import { ComparisonCheckbox } from "./ComparisonCheckbox";
import { FiltersCheckbox } from "./FiltersCheckbox";
import { MergeDistrictsCheckbox } from "./MergeDistrictsCheckbox";
import { Votes, Metrics, Parameters } from "../../../requested-data/requested-data-models";
import { districtMap, mergeVoteDistricts, mergeMetricDistricts } from "../../../computation/logic/district-merging";
import { ComputationMenuPayload } from "../../ComputationMenu/computation-menu-models";
import { Use2021DistributionCheckbox } from "./Use2021DistributionCheckbox";
import { getVotesForYear, getMetricsForYear, getMetricsYear } from "../../../utilities/data-filters";
import { reform2005Applies } from "../../../utilities/conditionals";

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
    toggleShowFilters: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showFilters: boolean;
    year: number;
    mergeDistricts: boolean;
    toggleMergeDistricts: (checked: boolean) => void;
    use2021Distribution: boolean;
    toggleUse2021Distribution: (checked: boolean) => void;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters;
    computationPayload: ComputationPayload;
    settingsPayload: ComputationMenuPayload;
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => any;
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

    /**
     * Helper function for evaluating whether filters checkbox should be shown.
     *
     * @returns true if filters checkbox should be shown, false otherwise
     */
    showFilters(): boolean {
        return this.props.currentPresentation === PresentationType.ElectionTable;
    }

    /**
     * Helper function for evaluating whether filters checkbox should be shown.
     *
     * @returns true if filters checkbox should be shown, false otherwise
     */
    showNoSeatsCheckbox(): boolean {
        return (
            this.props.currentPresentation !== PresentationType.DistrictTable &&
            this.props.currentPresentation !== PresentationType.LevellingSeats
        );
    }

    onToggleMergeDistricts = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.toggleMergeDistricts(event.target.checked);

        const year = this.props.year;
        let votes = getVotesForYear(this.props.votes, year);
        const metricsYear = getMetricsYear(this.props.use2021Distribution, year);
        let metrics = getMetricsForYear(this.props.metrics, metricsYear);
        const parameters = this.props.parameters;

        if (votes.length > 0) {
            if (reform2005Applies(year) && event.target.checked) {
                votes = mergeVoteDistricts(votes, districtMap);
                metrics = mergeMetricDistricts(metrics, districtMap);
            }

            this.props.updateCalculation(
                {
                    ...this.props.computationPayload,
                    metrics,
                    votes,
                    parameters,
                },
                this.props.settingsPayload.autoCompute,
                false
            );
        }
    };

    onToggleUse2021Distribution = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.toggleUse2021Distribution(event.target.checked);

        const year = this.props.year;
        let votes = getVotesForYear(this.props.votes, year);
        const metricsYear = getMetricsYear(event.target.checked, year);
        let metrics = getMetricsForYear(this.props.metrics, metricsYear);
        const parameters = this.props.parameters;

        if (votes.length > 0) {
            if (reform2005Applies(year) && this.props.mergeDistricts) {
                votes = mergeVoteDistricts(votes, districtMap);
                metrics = mergeMetricDistricts(metrics, districtMap);
            }

            this.props.updateCalculation(
                {
                    ...this.props.computationPayload,
                    metrics,
                    votes,
                    parameters,
                },
                this.props.settingsPayload.autoCompute,
                false
            );
        }
    };

    render() {
        return (
            <div className="columns">
                <div className="columns">
                    <div className="column min-column-width">
                        <NoSeatsCheckbox
                            hidden={!this.showNoSeatsCheckbox()}
                            showPartiesWithoutSeats={this.props.showPartiesWithoutSeats}
                            toggleShowPartiesWithoutSeats={this.props.toggleShowPartiesWithoutSeats}
                        />
                        <FiltersCheckbox
                            hidden={!this.showFilters()}
                            showFilters={this.props.showFilters}
                            toggleShowFilters={this.props.toggleShowFilters}
                        />
                        <ComparisonCheckbox
                            hidden={!this.showComparison()}
                            showComparison={this.props.showComparison}
                            toggleComparison={this.props.toggleShowComparison}
                        />
                    </div>
                    <div className="column">
                        <MergeDistrictsCheckbox
                            hidden={!reform2005Applies(this.props.year)}
                            mergeDistricts={this.props.mergeDistricts}
                            toggleMergeDistricts={this.onToggleMergeDistricts}
                        />
                        <Use2021DistributionCheckbox
                            hidden={!reform2005Applies(this.props.year)}
                            use2021Distribution={this.props.use2021Distribution}
                            toggleUse2021Distribution={this.onToggleUse2021Distribution}
                        />
                    </div>
                </div>
                <div className="column">
                    <div className="columns">
                        <div className="column">
                            <SmartNumericInput
                                hidden={!this.needsDecimals()}
                                name="decimalPlaces"
                                defaultValue={2}
                                min={0}
                                max={16}
                                integer={true}
                                slider={false}
                                title="Antall desimaler"
                                value={this.props.decimals}
                                onChange={this.props.changeDecimals}
                            />
                        </div>
                        <div className="column">
                            <DisproportionalitySelect
                                hidden={!this.showDisproportionalitySelect()}
                                changeDisproportionalityIndex={this.props.changeDisproportionalityIndex}
                                disproportionalityIndex={this.props.disproportionalityIndex}
                                tooltip={
                                    <TooltipInfo
                                        text={"Her kan du velge mellom Loosemore-Hanbys (L-H) og Gallaghers (LSq)."}
                                        url={"https://project-lavinia.github.io/#Disproporsjonalitetsindeks"}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
