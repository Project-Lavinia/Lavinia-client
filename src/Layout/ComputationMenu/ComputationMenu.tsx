import * as React from "react";
import { SmartNumericInput, SmartNumericInputWithLabel, TooltipInfo, TooltipInfoRight } from "../../common";
import { ElectionType, Election, Votes, Metrics, Parameters } from "../../requested-data/requested-data-models";
import { ComputationPayload, AlgorithmType, unloadedParameters } from "../../computation";
import { ComputationMenuPayload } from "./computation-menu-models";
import { YearSelect } from "./YearSelect";
import { AlgorithmSelect } from "./AlgorithmSelect";
import { AutoComputeCheckbox } from "./AutoComputeCheckbox";
import { ResetButton } from "./ResetButton";
import { ComparisonOptions } from "./ComparisonOptions";
import { ComputeManuallyButton } from "./ComputeManuallyButton";
import {
    mergeElectionDistricts,
    districtMap,
    mergeVoteDistricts,
    mergeMetricDistricts,
} from "../../computation/logic/district-merging";
import { shouldDistributeDistrictSeats } from "../../utilities/conditionals";
import { isLargestFractionAlgorithm } from "../../computation/logic";

const WIKIURL = "https://project-lavinia.github.io";

export interface ComputationMenuProps {
    electionType: ElectionType;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
    settingsPayload: ComputationMenuPayload;
    computationPayload: ComputationPayload;
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => any;
    updateSettings: (settingsPayload: ComputationMenuPayload) => any;
    toggleAutoCompute: (autoCompute: boolean) => any;
    resetToHistoricalSettings: (
        settingsPayload: ComputationMenuPayload,
        election: Election,
        votes: Votes[],
        metrics: Metrics[],
        parameters: Parameters
    ) => any;
    resetHistorical: (election: Election, votes: Votes[], metrics: Metrics[], parameters: Parameters) => void;
    resetComparison: () => void;
    saveComparison: () => void;
    showComparison: boolean;
    mergeDistricts: boolean;
    use2021Distribution: boolean;
}

export class ComputationMenu extends React.Component<ComputationMenuProps, {}> {
    /**
     * Helper function to determine whether the first divisor SmartNumericInput
     * should be visible.
     *
     * @returns true if it should be hidden, false if it should not
     */
    shouldHideFirstDivisor(): boolean {
        return (
            this.props.computationPayload.algorithm === AlgorithmType.D_HONDT ||
            isLargestFractionAlgorithm(this.props.computationPayload.algorithm)
        );
    }

    /**
     * Helper function to update the calculation and settings on user
     * interaction.
     *
     * @param event a ChangeEvent whose target carries the stringified year
     */
    onYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextYear = parseInt(event.target.value);
        let election = this.props.electionType.elections.find((election) => election.year === nextYear);
        let votes = this.props.votes.filter((vote) => vote.electionYear === nextYear);
        const distributionYear = this.props.use2021Distribution && nextYear >= 2005 ? 2021 : nextYear;
        let metrics = this.props.metrics.filter((metric) => metric.electionYear === distributionYear);
        const parameters =
            this.props.parameters.find((parameter) => parameter.electionYear === nextYear) || unloadedParameters;

        if (election !== undefined) {
            if (shouldDistributeDistrictSeats(nextYear) && this.props.mergeDistricts) {
                election = mergeElectionDistricts(election, districtMap);
                votes = mergeVoteDistricts(votes, districtMap);
                metrics = mergeMetricDistricts(metrics, districtMap);
            }

            this.props.updateCalculation(
                {
                    ...this.props.computationPayload,
                    election,
                    metrics,
                    votes,
                    parameters,
                },
                this.props.settingsPayload.autoCompute,
                false
            );
            this.props.resetHistorical(election, votes, metrics, parameters);
            this.props.resetComparison();
            this.props.resetToHistoricalSettings(
                {
                    ...this.props.settingsPayload,
                    year: event.target.value,
                },
                election,
                votes,
                metrics,
                parameters
            );
        }
    };

    /**
     * Helper function to update the calculation and settings on user
     * interaction.
     *
     * @param event a ChangeEvent whose target carries the numerified algorithm
     */
    onAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const algorithmType = event.target.value as AlgorithmType;
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                algorithm: algorithmType,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
        this.props.updateSettings({
            ...this.props.settingsPayload,
            algorithm: algorithmType,
        });
    };

    /**
     * Helper function to update the calculation and settings on
     * user interaction.
     *
     * @param stringValue the string value of the first divisor
     * @param numericValue the numeric value of the first divisor
     */
    onFirstDivisorChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            firstDivisor: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                firstDivisor: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update the calculation and settings on
     * user interaction.
     *
     * @param stringValue the string value of the threshold
     * @param numericValue the numeric value of the threshold
     */
    onThresholdChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            electionThreshold: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                electionThreshold: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update the calculation and settings on
     * user interaction.
     *
     * @param stringValue the string value of the district threshold
     * @param numericValue the numeric value of the district threshold
     */
    onDistrictThresholdChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            districtThreshold: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                districtThreshold: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update the calculation and settings on
     * user interaction.
     *
     * @param stringValue the string value of the no. of district seats
     * @param numericValue the numeric value of the no. of district seats
     */
    onDistrictSeatsChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            districtSeats: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                districtSeats: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update the calculation and settings on
     * user interaction.
     *
     * @param stringValue the string value of the no. of levelling seats
     * @param numericValue the numeric value of the no. of levelling seats
     */
    onLevelingSeatsChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            levelingSeats: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                levelingSeats: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update the calculation and settings on user
     * interaction.
     *
     * @param stringValue the string value of the area factor
     * @param numericValue the numeric value of the area factor
     */
    onAreaFactorChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            areaFactor: stringValue,
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                areaFactor: numericValue,
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };

    /**
     * Helper function to update whether or not automatic computation is
     * enabled. Ensures computation is performed whenever toggled.
     *
     * @param event ChangeEvent for whether or not it is checked
     */
    toggleAutoCompute = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.toggleAutoCompute(event.target.checked);
        this.computeManually();
    };

    /**
     * Helper function to perform a manual computation of the current values.
     *
     */
    computeManually = () => {
        const year = parseInt(this.props.settingsPayload.year);
        const election = this.props.electionType.elections.find((e) => e.year === year);
        const votes = this.props.votes.filter((vote) => vote.electionYear === year);
        const distributionYear = this.props.use2021Distribution && year >= 2005 ? 2021 : year;
        const metrics = this.props.metrics.filter((metric) => metric.electionYear === distributionYear);
        const parameters =
            this.props.parameters.find((parameter) => parameter.electionYear === year) || unloadedParameters;
        if (election !== undefined && election !== null) {
            this.props.updateCalculation(
                {
                    election,
                    algorithm: this.props.settingsPayload.algorithm,
                    firstDivisor: parseFloat(this.props.settingsPayload.firstDivisor),
                    electionThreshold: parseFloat(this.props.settingsPayload.electionThreshold),
                    districtThreshold: parseFloat(this.props.settingsPayload.districtThreshold),
                    districtSeats: parseInt(this.props.settingsPayload.districtSeats),
                    levelingSeats: parseInt(this.props.settingsPayload.levelingSeats),
                    areaFactor: parseFloat(this.props.settingsPayload.areaFactor),
                    votes,
                    metrics,
                    parameters,
                },
                this.props.settingsPayload.autoCompute,
                true
            );
        }
    };

    /**
     * Helper function for restoring both the settings and the computation to
     * their original, default state for the current year selected.
     */
    restoreToDefault = () => {
        const compPayload = this.props.computationPayload;
        this.props.resetToHistoricalSettings(
            this.props.settingsPayload,
            compPayload.election,
            compPayload.votes,
            compPayload.metrics,
            compPayload.parameters
        );
    };

    /**
     * Helper function to check if settings have changed.
     */
    settingsChanged = () => {
        const { settingsPayload } = this.props;
        const { comparison } = settingsPayload;
        return (settingsPayload.algorithm !==
            comparison.algorithm)
            ||
            (comparison.firstDivisor !==
                settingsPayload.firstDivisor)
            ||
            (settingsPayload.electionThreshold !==
                comparison.electionThreshold)
            ||
            (comparison.districtThreshold !==
                settingsPayload.districtThreshold)
            ||
            (settingsPayload.levelingSeats !==
                comparison.levelingSeats)
            ||
            (settingsPayload.districtSeats !==
                comparison.districtSeats)
            ||
            (comparison.areaFactor !==
                settingsPayload.areaFactor);
    }

    render() {
        const year = parseInt(this.props.settingsPayload.year);
        return (
            <div>
                <h1 className="is-size-6-mobile is-size-4-tablet is-size-2-desktop is-size-1-widescreen">
                    Stortingsvalg
                </h1>
                <form>
                    <AutoComputeCheckbox
                        autoCompute={this.props.settingsPayload.autoCompute}
                        computeManually={this.computeManually}
                        toggleAutoCompute={this.toggleAutoCompute}
                    />
                    <YearSelect
                        electionYears={this.props.settingsPayload.electionYears}
                        onYearChange={this.onYearChange}
                        year={this.props.settingsPayload.year}
                        tooltip={
                            <TooltipInfoRight
                                text={"Her kan du velge året stortingsvalget ble holdt."}
                                url={WIKIURL + "/#Valgt%20%C3%A5r"}
                            />
                        }
                    />
                    <AlgorithmSelect
                        algorithm={this.props.settingsPayload.algorithm}
                        defaultAlgorithm={this.props.settingsPayload.comparison.algorithm}
                        onAlgorithmChange={this.onAlgorithmChange}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du velge beregningsmetode for fordeling av mandater."}
                                url={WIKIURL + "/#Valgt%20metode"}
                            />
                        }
                    />
                    <SmartNumericInput
                        hidden={this.shouldHideFirstDivisor()}
                        name="firstDivisor"
                        title="Første delingstall"
                        value={this.props.settingsPayload.firstDivisor}
                        onChange={this.onFirstDivisorChange}
                        min={1}
                        max={5}
                        defaultValue={this.props.computationPayload.election.firstDivisor}
                        originalValue={this.props.settingsPayload.comparison.firstDivisor}
                        integer={false}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du forandre det første delingstallet i Sainte-Laguës metode."}
                                url={WIKIURL + "/#F%C3%B8rste%20delingstall"}
                            />
                        }
                    />
                    <SmartNumericInputWithLabel
                        name="electionThreshold"
                        title="Sperregrense for utjevningsmandater"
                        value={this.props.settingsPayload.electionThreshold}
                        onChange={this.onThresholdChange}
                        min={0}
                        max={15}
                        defaultValue={this.props.computationPayload.election.threshold}
                        originalValue={this.props.settingsPayload.comparison.electionThreshold}
                        integer={false}
                        label={"%"}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du forandre sperregrensen for å få tildelt utjevningsmandat."}
                                url={WIKIURL + "/#Sperregrense%20for%20utjevningsmandat"}
                            />
                        }
                    />
                    <SmartNumericInputWithLabel
                        name="districtThreshold"
                        title="Sperregrense for distriktmandat"
                        value={this.props.settingsPayload.districtThreshold}
                        onChange={this.onDistrictThresholdChange}
                        min={0}
                        max={15}
                        defaultValue={0}
                        originalValue={this.props.settingsPayload.comparison.districtThreshold}
                        integer={false}
                        label={"%"}
                        isHiddenTouch={true}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du sette inn en sperregrense også for distriktsmandatene."}
                                url={WIKIURL + "/#Sperregrense%20for%20distriktmandat"}
                            />
                        }
                    />
                    <SmartNumericInput
                        name="levelingSeats"
                        title="Utjevningsmandater"
                        value={this.props.settingsPayload.levelingSeats}
                        onChange={this.onLevelingSeatsChange}
                        min={0}
                        max={100}
                        defaultValue={this.props.computationPayload.election.levelingSeats}
                        originalValue={this.props.settingsPayload.comparison.levelingSeats}
                        integer={true}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du endre antall utjevningsmandater."}
                                url={WIKIURL + "/#Utjevningsmandater"}
                            />
                        }
                    />
                    <SmartNumericInput
                        name="districtSeats"
                        title="Distriktsmandater"
                        value={this.props.settingsPayload.districtSeats}
                        onChange={this.onDistrictSeatsChange}
                        min={0}
                        max={500}
                        defaultValue={this.props.computationPayload.election.seats}
                        originalValue={this.props.settingsPayload.comparison.districtSeats}
                        integer={true}
                        hidden={!shouldDistributeDistrictSeats(year)}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du endre antall distriktsmandater."}
                                url={WIKIURL + "/#Distriktsmandater"}
                            />
                        }
                    />
                    <SmartNumericInput
                        name="areaFactor"
                        title="Arealfaktor"
                        value={this.props.settingsPayload.areaFactor}
                        onChange={this.onAreaFactorChange}
                        min={0}
                        max={3}
                        defaultValue={this.props.computationPayload.parameters.areaFactor}
                        originalValue={this.props.settingsPayload.comparison.areaFactor}
                        integer={false}
                        hidden={!shouldDistributeDistrictSeats(year)}
                        tooltip={
                            <TooltipInfo
                                text={"Her kan du endre balansen mellom folketall og fylkets areal."}
                                url={WIKIURL + "/#Arealfaktor"}
                            />
                        }
                    />
                    <ComputeManuallyButton
                        autoCompute={this.props.settingsPayload.autoCompute}
                        computeManually={this.computeManually}
                    />

                    <ResetButton restoreToDefault={this.restoreToDefault} highlight={this.settingsChanged()}/>
                    <ComparisonOptions
                        showComparison={this.props.showComparison}
                        resetComparison={this.props.resetComparison}
                        saveComparison={this.props.saveComparison}
                    />
                </form>
            </div>
        );
    }
}
