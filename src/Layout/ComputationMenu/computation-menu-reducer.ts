import { ComputationMenuActionType, ComputationMenuAction } from "./computation-menu-actions";
import { ComputationMenuState, unloadedState } from "./computation-menu-state";
import { checkExhaustively } from "../../utilities";
import { GlobalActionType } from "../../reducers/global-actions";

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
                areaFactor: action.areaFactor,
                autoCompute: action.autoCompute,
                comparison: {
                    algorithm: action.algorithm,
                    areaFactor: action.areaFactor,
                    districtSeats: action.districtSeats,
                    electionThreshold: action.electionThreshold,
                    districtThreshold: action.districtThreshold,
                    firstDivisor: action.firstDivisor,
                    levelingSeats: action.levelingSeats,
                },
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
        case ComputationMenuActionType.SAVE_SETTINGS:
            return {
                ...state,
                comparison: {
                    algorithm: state.algorithm,
                    areaFactor: state.areaFactor,
                    districtSeats: state.districtSeats,
                    electionThreshold: state.electionThreshold,
                    districtThreshold: state.districtThreshold,
                    firstDivisor: state.firstDivisor,
                    levelingSeats: state.levelingSeats,
                },
            };
        case ComputationMenuActionType.RESET_SAVED_SETTINGS:
            return {
                ...state,
                algorithm: state.comparison.algorithm,
                areaFactor: state.comparison.areaFactor,
                districtSeats: state.comparison.districtSeats,
                electionThreshold: state.comparison.electionThreshold,
                districtThreshold: state.comparison.districtThreshold,
                firstDivisor: state.comparison.firstDivisor,
                levelingSeats: state.comparison.levelingSeats,
            };
        case ComputationMenuActionType.TOGGLE_AUTO_COMPUTE:
            return {
                ...state,
                autoCompute: action.autoCompute,
            };
        case GlobalActionType.CLEAR_STATE:
            return unloadedState;
        default:
            checkExhaustively(action);
            return state;
    }
}
