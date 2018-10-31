import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { SettingMenuComponent, SettingMenuProps } from "./SettingMenuComponent";
import { updateSettings, toggleAutoCompute } from ".";
import { SettingsPayload } from "../Interfaces/Payloads";
import { ComputationPayload, updateElectionData } from "../../computation";
import { Election } from "../../requested-data/requested-data-models";
import { getAlgorithmType } from "../../computation/Logic";

const mapStateToProps = (state: RootState): Partial<SettingMenuProps> => ({
    computationPayload: {
        election: state.computationState.election,
        algorithm: state.computationState.algorithm,
        firstDivisor: state.computationState.firstDivisor,
        electionThreshold: state.computationState.electionThreshold,
        districtSeats: state.computationState.districtSeats,
        levelingSeats: state.computationState.levelingSeats
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
        forceCompute: false
    },
    electionType: state.requestedDataState.electionType
});

const mapDispatchToProps = (dispatch: any): Partial<SettingMenuProps> => ({
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => {
        if (autoCompute || forceCompute) {
            const payload: ComputationPayload = {
                election: computationPayload.election,
                algorithm: computationPayload.algorithm,
                firstDivisor: computationPayload.firstDivisor,
                electionThreshold: computationPayload.electionThreshold,
                districtSeats: computationPayload.districtSeats,
                levelingSeats: computationPayload.levelingSeats
            };
            const updateCalculationAction = updateElectionData(payload);
            dispatch(updateCalculationAction);
        }
    },
    updateSettings: (settingsPayload: SettingsPayload) => {
        const updateSettingsAction = updateSettings(settingsPayload);
        dispatch(updateSettingsAction);
    },
    toggleAutoCompute: (isChecked: boolean) => {
        const toggleAutoComputeAction = toggleAutoCompute(isChecked);
        dispatch(toggleAutoComputeAction);
    },
    resetToHistoricalSettings: (settingsPayload: SettingsPayload, election: Election) => {
        if (settingsPayload.autoCompute) {
            const payload: ComputationPayload = {
                election,
                algorithm: getAlgorithmType(election.algorithm),
                firstDivisor: election.firstDivisor,
                electionThreshold: election.threshold,
                districtSeats: election.seats,
                levelingSeats: election.levelingSeats
            };
            const updateCalculationAction = updateElectionData(payload);
            dispatch(updateCalculationAction);
        }

        const newSettingsPayload: SettingsPayload = {
            ...settingsPayload,
            algorithm: election.algorithm,
            firstDivisor: election.firstDivisor.toString(),
            electionThreshold: election.threshold.toString(),
            districtSeats: election.seats.toString(),
            levelingSeats: election.levelingSeats.toString()
        };
        const updateSettingsAction = updateSettings(newSettingsPayload);
        dispatch(updateSettingsAction);
    }
});

export const SettingsMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingMenuComponent as any);
