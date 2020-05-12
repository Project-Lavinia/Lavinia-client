import { unloadedState, PresentationMenuState } from "./presentation-menu-state";
import { PresentationMenuActionType, PresentationMenuAction } from "./presentation-menu-actions";
import { checkExhaustively } from "../../utilities";

/**
 * Reducer for the presentation menu. Handles all state changes to the presentation menu.
 *
 * @param state - the current state, with default parameters iff it is
 * undefined.
 * @param action - the action to act upon the state.
 * @returns a new state mutated by the action passed in as parameter.
 */
export function presentationMenu(
    state: PresentationMenuState = unloadedState,
    action: PresentationMenuAction
): PresentationMenuState {
    switch (action.type) {
        case PresentationMenuActionType.INITIALIZE_PRESENTATION:
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats,
            };
        case PresentationMenuActionType.CHANGE_PRESENTATION:
            return {
                ...state,
                currentPresentation: action.presentationSelected,
            };
        case PresentationMenuActionType.CHANGE_DECIMALS:
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
            };
        case PresentationMenuActionType.SHOW_PARTIES_NO_SEATS:
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats,
            };
        case PresentationMenuActionType.SELECT_DISTRICT:
            return {
                ...state,
                districtSelected: action.districtSelected,
            };
        case PresentationMenuActionType.CHANGE_DISPROPORTIONALITY_INDEX:
            return {
                ...state,
                disproportionalityIndex: action.index,
            };
        case PresentationMenuActionType.TOGGLE_SHOW_COMPARISON:
            return {
                ...state,
                showComparison: action.showComparison,
            };
        case PresentationMenuActionType.TOGGLE_SHOW_FILTERS:
            return {
                ...state,
                showFilters: action.showFilters,
            };
        case PresentationMenuActionType.TOGGLE_MERGE_DISTRICTS:
            return {
                ...state,
                mergeDistricts: action.mergeDistricts,
            };
        case PresentationMenuActionType.TOGGLE_USE_2021_DISTRIBUTION:
            return {
                ...state,
                use2021Distribution: action.use2021Distribution,
            };
        default:
            checkExhaustively(action);
            return state;
    }
}
