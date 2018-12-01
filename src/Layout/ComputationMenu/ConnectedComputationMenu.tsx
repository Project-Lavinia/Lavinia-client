import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { ComputationMenuProps, ComputationMenu } from "./ComputationMenu";
import { updateComputationMenu, toggleAutoCompute } from ".";
import { ComputationPayload, updateComputation, resetSavedComputation } from "../../computation";
import { Election } from "../../requested-data/requested-data-models";
import { getAlgorithmType } from "../../computation/logic";
import { ComputationMenuPayload } from "./computation-menu-models";

const mapStateToProps = (
    state: RootState
): Pick<ComputationMenuProps, "computationPayload" | "settingsPayload" | "electionType"> => ({
    computationPayload: {
        election: state.computationState.election,
        algorithm: state.computationState.algorithm,
        firstDivisor: state.computationState.firstDivisor,
        electionThreshold: state.computationState.electionThreshold,
        districtSeats: state.computationState.districtSeats,
        levelingSeats: state.computationState.levelingSeats,
    },
    settingsPayload: {
        electionYears: state.settingsState.electionYears,
        year: state.settingsState.year,
        algorithm: state.settingsState.algorithm,
        firstDivisor: state.settingsState.firstDivisor,
        electionThreshold: state.settingsState.electionThreshold,
        districtSeats: state.settingsState.districtSeats,
        levelingSeats: state.settingsState.levelingSeats,
        autoCompute: state.settingsState.autoCompute,
        forceCompute: false,
    },
    electionType: state.requestedDataState.electionType,
});

const mapDispatchToProps = (
    dispatch: any
): Pick<
    ComputationMenuProps,
    "updateCalculation" | "updateSettings" | "toggleAutoCompute" | "resetToHistoricalSettings" | "resetComparison"
> => ({
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => {
        if (autoCompute || forceCompute) {
            const payload: ComputationPayload = {
                election: computationPayload.election,
                algorithm: computationPayload.algorithm,
                firstDivisor: computationPayload.firstDivisor,
                electionThreshold: computationPayload.electionThreshold,
                districtSeats: computationPayload.districtSeats,
                levelingSeats: computationPayload.levelingSeats,
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
    resetToHistoricalSettings: (settingsPayload: ComputationMenuPayload, election: Election) => {
        if (settingsPayload.autoCompute) {
            const payload: ComputationPayload = {
                election,
                algorithm: getAlgorithmType(election.algorithm),
                firstDivisor: election.firstDivisor,
                electionThreshold: election.threshold,
                districtSeats: election.seats,
                levelingSeats: election.levelingSeats,
            };
            const updateCalculationAction = updateComputation(payload);
            dispatch(updateCalculationAction);
        }

        const newSettingsPayload: ComputationMenuPayload = {
            ...settingsPayload,
            algorithm: election.algorithm,
            firstDivisor: election.firstDivisor.toString(),
            electionThreshold: election.threshold.toString(),
            districtSeats: election.seats.toString(),
            levelingSeats: election.levelingSeats.toString(),
        };
        const updateSettingsAction = updateComputationMenu(newSettingsPayload);
        dispatch(updateSettingsAction);
    },
    resetComparison: () => {
        const resetSavedComputationAction = resetSavedComputation();
        dispatch(resetSavedComputationAction);
    },
});

export const ConnectedComputationMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(ComputationMenu as any);
