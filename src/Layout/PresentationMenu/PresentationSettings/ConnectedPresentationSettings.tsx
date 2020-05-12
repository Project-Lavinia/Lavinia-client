import { RootState } from "../../../reducers";
import { connect } from "react-redux";
import { PresentationSettingsMenu, PresentationSettingsProps } from "./PresentationSettings";
import {
    selectDistrict,
    changeDecimals,
    changeShowPartiesNoSeats,
    changeDisproportionalityIndex,
    toggleShowComparison,
    toggleShowFilters,
    toggleMergeDistricts,
    toggleUse2021Distribution,
} from "../presentation-menu-actions";
import { DisproportionalityIndex } from "../../Presentation/presentation-models";
import { ComputationPayload, updateComputation } from "../../../computation";

/**
 * Describes which properties we want to pick from the properties of the
 * component for mapping from state to props.
 */
interface StateProps
    extends Pick<
        PresentationSettingsProps,
        | "currentPresentation"
        | "districtSelected"
        | "decimals"
        | "showPartiesWithoutSeats"
        | "results"
        | "disproportionalityIndex"
        | "showComparison"
        | "showFilters"
        | "year"
        | "mergeDistricts"
        | "use2021Distribution"
        | "electionType"
        | "votes"
        | "metrics"
        | "parameters"
        | "computationPayload"
        | "settingsPayload"
    > {}

function mapStateToProps(state: RootState): StateProps {
    return {
        currentPresentation: state.presentationMenuState.currentPresentation,
        decimals: state.presentationMenuState.decimals,
        results: state.computationState.current,
        showPartiesWithoutSeats: state.presentationMenuState.showPartiesWithoutSeats,
        districtSelected: state.presentationMenuState.districtSelected,
        disproportionalityIndex: state.presentationMenuState.disproportionalityIndex,
        showComparison: state.presentationMenuState.showComparison,
        showFilters: state.presentationMenuState.showFilters,
        year: state.computationState.election.year,
        mergeDistricts: state.presentationMenuState.mergeDistricts,
        use2021Distribution: state.presentationMenuState.use2021Distribution,
        electionType: state.requestedDataState.electionType,
        votes: state.requestedDataState.votes,
        metrics: state.requestedDataState.metrics,
        parameters: state.computationState.parameters,
        computationPayload: {
            election: state.computationState.election,
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
    };
}

/**
 * Describes which properties we want to pick from the properties of the
 * component for mapping from dispatch to props.
 */
interface DispatchProps
    extends Pick<
        PresentationSettingsProps,
        | "changeDecimals"
        | "toggleShowPartiesWithoutSeats"
        | "selectDistrict"
        | "changeDisproportionalityIndex"
        | "toggleShowComparison"
        | "toggleShowFilters"
        | "toggleMergeDistricts"
        | "toggleUse2021Distribution"
        | "updateCalculation"
    > {}

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    changeDecimals: (decimals: string, decimalsNumber: number) => {
        const action = changeDecimals(decimals, decimalsNumber);
        dispatch(action);
    },
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => {
        const action = changeShowPartiesNoSeats(event.target.checked);
        dispatch(action);
    },
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => {
        const action = selectDistrict(event.target.value);
        dispatch(action);
    },
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => {
        const action = changeDisproportionalityIndex(event.target.value as DisproportionalityIndex);
        dispatch(action);
    },
    toggleShowComparison: (event: React.ChangeEvent<HTMLInputElement>) => {
        const action = toggleShowComparison(event.target.checked);
        dispatch(action);
    },
    toggleShowFilters: (event: React.ChangeEvent<HTMLInputElement>) => {
        const action = toggleShowFilters(event.target.checked);
        dispatch(action);
    },
    toggleMergeDistricts: (checked: boolean) => {
        const action = toggleMergeDistricts(checked);
        dispatch(action);
    },
    toggleUse2021Distribution: (checked: boolean) => {
        const action = toggleUse2021Distribution(checked);
        dispatch(action);
    },
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => {
        if (autoCompute || forceCompute) {
            const payload: ComputationPayload = {
                election: computationPayload.election,
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
            };
            const updateCalculationAction = updateComputation(payload);
            dispatch(updateCalculationAction);
        }
    },
});

export const ConnectedPresentationSettings = connect(
    mapStateToProps,
    mapDispatchToProps
)(PresentationSettingsMenu as any);
