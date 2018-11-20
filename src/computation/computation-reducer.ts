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
export function computationReducer(
    state: ComputationState = unloadedState,
    action: ComputationAction
): ComputationState {
    switch (action.type) {
        case ComputationActionType.INITIALIZE_COMPUTATION:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                results: action.results
            };
        case ComputationActionType.UPDATE_COMPUTATION:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                results: action.results
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            checkExhaustively(action);
            return state;
    }
}
