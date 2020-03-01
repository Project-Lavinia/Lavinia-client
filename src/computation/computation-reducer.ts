import { ComputationState, unloadedState } from "./computation-state";
import { ComputationActionType, ComputationAction } from "./computation-actions";
import { checkExhaustively } from "../utilities";

/**
 * Reducer for computations. Handles all state changes to the computation.
 *
 * @param state - the current state, with default parameters passed in iff it is
 * undefined
 * @param action - the action to act upon the state
 * @returns a new state mutated by the action passed in as parameter
 */
export function computation(state: ComputationState = unloadedState, action: ComputationAction): ComputationState {
    switch (action.type) {
        case ComputationActionType.INITIALIZE_COMPUTATION:
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                areaFactor: action.areaFactor,
                current: action.results,
                historical: action.results,
                comparison: action.results,
                votes: action.votes,
                metrics: action.metrics,
                parameters: action.parameters,
            };
        case ComputationActionType.UPDATE_COMPUTATION:
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                areaFactor: action.areaFactor,
                current: action.results,
                votes: action.votes,
                metrics: action.metrics,
                parameters: action.parameters,
            };
        case ComputationActionType.SAVE_COMPUTATION:
            return {
                ...state,
                comparison: state.current,
            };
        case ComputationActionType.RESET_SAVED_COMPUTATION:
            return {
                ...state,
                comparison: state.historical,
            };
        case ComputationActionType.UPDATE_HISTORICAL:
            return {
                ...state,
                historical: action.historical,
            };
        default:
            checkExhaustively(action);
            return state;
    }
}
