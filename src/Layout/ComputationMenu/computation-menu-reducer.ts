import { ComputationMenuActionType, ComputationMenuAction } from "./computation-menu-actions";
import { ComputationMenuState, unloadedState } from "./computation-menu-state";
import { checkExhaustively } from "../../utilities";

/**
 * Reducer for the computation menu. Handles all state changes to the
 * computation menu.
 *
 * @param state - the current state, with default parameters passed in iff it is
 * undefined
 * @param action - the action to act upon the state
 * @returns a new state mutated by the action passed in as parameter
 */
export function computationMenu(
    state: ComputationMenuState = unloadedState,
    action: ComputationMenuAction
): ComputationMenuState {
    switch (action.type) {
        case ComputationMenuActionType.INITIALIZE_COMPUTATION_MENU:
            return {
                ...state,
                electionYears: action.electionYears,
                year: action.year,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtThreshold: action.districtThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                autoCompute: action.autoCompute,
                areaFactor: action.areaFactor,
            };
        case ComputationMenuActionType.UPDATE_COMPUTATION_MENU:
            return {
                ...state,
                year: action.year,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtThreshold: action.districtThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                areaFactor: action.areaFactor,
            };
        case ComputationMenuActionType.TOGGLE_AUTO_COMPUTE:
            return {
                ...state,
                autoCompute: action.autoCompute,
            };
        default:
            checkExhaustively(action);
            return state;
    }
}
