import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { ComputationMenuProps, ComputationMenu } from "./ComputationMenu";
import { updateComputationMenu, toggleAutoCompute, saveSettings, resetSavedSettings } from ".";
import {
    ComputationPayload,
    updateComputation,
    resetSavedComputation,
    updateHistorical,
    saveComparison,
    computationDefaults,
} from "../../computation";
import { Votes, Metrics, Parameters } from "../../requested-data/requested-data-models";
import { ComputationMenuPayload } from "./computation-menu-models";
import { Dictionary } from "../../utilities/dictionary";

const mapStateToProps = (
    state: RootState
): Pick<
    ComputationMenuProps,
    | "computationPayload"
    | "settingsPayload"
    | "showComparison"
    | "parameters"
    | "metrics"
    | "votes"
    | "mergeDistricts"
    | "use2021Distribution"
> => ({
    computationPayload: {
        algorithm: state.computationState.algorithm,
        firstDivisor: state.computationState.firstDivisor,
        electionThreshold: state.computationState.electionThreshold,
        districtThreshold: state.computationState.districtThreshold,
        districtSeats: state.computationState.districtSeats,
        levelingSeats: state.computationState.levelingSeats,
        areaFactor: state.computationState.areaFactor,
        votes: state.computationState.votes,
        metrics: state.computationState.metrics,
        parameters: state.computationState.parameters,
        partyMap: state.requestedDataState.partyMap,
    },
    settingsPayload: {
        electionYears: state.settingsState.electionYears,
        year: state.settingsState.year,
        algorithm: state.settingsState.algorithm,
        firstDivisor: state.settingsState.firstDivisor,
        electionThreshold: state.settingsState.electionThreshold,
        districtThreshold: state.settingsState.districtThreshold,
        districtSeats: state.settingsState.districtSeats,
        levelingSeats: state.settingsState.levelingSeats,
        autoCompute: state.settingsState.autoCompute,
        forceCompute: false,
        areaFactor: state.settingsState.areaFactor,
        comparison: state.settingsState.comparison,
    },
    showComparison: state.presentationMenuState.showComparison,
    parameters: state.requestedDataState.parameters,
    metrics: state.requestedDataState.metrics,
    votes: state.requestedDataState.votes,
    mergeDistricts: state.presentationMenuState.mergeDistricts,
    use2021Distribution: state.presentationMenuState.use2021Distribution,
});

const mapDispatchToProps = (
    dispatch: any
): Pick<
    ComputationMenuProps,
    | "updateCalculation"
    | "updateSettings"
    | "toggleAutoCompute"
    | "resetToHistoricalSettings"
    | "resetComparison"
    | "resetHistorical"
    | "saveComparison"
> => ({
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => {
        if (autoCompute || forceCompute) {
            const payload: ComputationPayload = {
                algorithm: computationPayload.algorithm,
                firstDivisor: computationPayload.firstDivisor,
                electionThreshold: computationPayload.electionThreshold,
                districtThreshold: computationPayload.districtThreshold,
                districtSeats: computationPayload.districtSeats,
                levelingSeats: computationPayload.levelingSeats,
                areaFactor: computationPayload.areaFactor,
                votes: computationPayload.votes,
                metrics: computationPayload.metrics,
                parameters: computationPayload.parameters,
                partyMap: computationPayload.partyMap,
            };
            const updateCalculationAction = updateComputation(payload);
            dispatch(updateCalculationAction);
        }
    },
    updateSettings: (settingsPayload: ComputationMenuPayload) => {
        const updateSettingsAction = updateComputationMenu(settingsPayload);
        dispatch(updateSettingsAction);
    },
    toggleAutoCompute: (isChecked: boolean) => {
        const toggleAutoComputeAction = toggleAutoCompute(isChecked);
        dispatch(toggleAutoComputeAction);
    },
    resetToHistoricalSettings: (
        settingsPayload: ComputationMenuPayload,
        votes: Votes[],
        metrics: Metrics[],
        parameters: Parameters,
        partyMap: Dictionary<string>
    ) => {
        const firstDivisor = parameters.algorithm.parameters["First Divisor"]
            ? parameters.algorithm.parameters["First Divisor"]
            : computationDefaults.firstDivisor;

        if (settingsPayload.autoCompute) {
            const payload: ComputationPayload = {
                algorithm: parameters.algorithm.algorithm,
                firstDivisor,
                electionThreshold: parameters.threshold,
                districtThreshold: 0,
                districtSeats: parameters.districtSeats,
                levelingSeats: parameters.levelingSeats,
                areaFactor: parameters.areaFactor,
                votes,
                metrics,
                parameters,
                partyMap,
            };
            const updateHistoricalAction = updateHistorical(votes, metrics, parameters, partyMap);
            dispatch(updateHistoricalAction);
            const updateCalculationAction = updateComputation(payload);
            dispatch(updateCalculationAction);
        }

        const newSettingsPayload: ComputationMenuPayload = {
            ...settingsPayload,
            algorithm: parameters.algorithm.algorithm,
            firstDivisor: firstDivisor.toString(),
            electionThreshold: parameters.threshold.toString(),
            districtThreshold: "0",
            districtSeats: parameters.districtSeats.toString(),
            levelingSeats: parameters.levelingSeats.toString(),
            areaFactor: parameters.areaFactor.toString(),
        };
        const updateSettingsAction = updateComputationMenu(newSettingsPayload);
        dispatch(updateSettingsAction);
        const saveSettingsAction = saveSettings();
        dispatch(saveSettingsAction);
    },
    resetComparison: () => {
        const resetSavedComputationAction = resetSavedComputation();
        dispatch(resetSavedComputationAction);
        const resetSavedSettingsAction = resetSavedSettings();
        dispatch(resetSavedSettingsAction);
    },
    resetHistorical: (votes: Votes[], metrics: Metrics[], parameters: Parameters, partyMap: Dictionary<string>) => {
        const updateHistoricalAction = updateHistorical(votes, metrics, parameters, partyMap);
        dispatch(updateHistoricalAction);
    },
    saveComparison: () => {
        const saveComparisonAction = saveComparison();
        dispatch(saveComparisonAction);
        const saveSettingsAction = saveSettings();
        dispatch(saveSettingsAction);
    },
});

export const ConnectedComputationMenu = connect(mapStateToProps, mapDispatchToProps)(ComputationMenu as any);
