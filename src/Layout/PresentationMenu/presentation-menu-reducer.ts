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
        case PresentationMenuActionType.InitializePresentation:
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats,
            };
        case PresentationMenuActionType.ChangePresentation:
            return {
                ...state,
                currentPresentation: action.presentationSelected,
            };
        case PresentationMenuActionType.ChangeDecimals:
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
            };
        case PresentationMenuActionType.ShowPartiesNoSeats:
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats,
            };
        case PresentationMenuActionType.SelectDistrict:
            return {
                ...state,
                districtSelected: action.districtSelected,
            };
        case PresentationMenuActionType.ChangeDisproportionalityIndex:
            return {
                ...state,
                disproportionalityIndex: action.index,
            };
        case PresentationMenuActionType.ToggleShowComparison:
            return {
                ...state,
                showComparison: action.showComparison,
            };
        default:
            checkExhaustively(action);
            return state;
    }
}
