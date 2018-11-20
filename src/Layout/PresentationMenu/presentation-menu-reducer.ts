import { unloadedState, PresentationMenuState } from "./presentation-menu-state";
import { PresentationMenuActionType, PresentationMenuAction } from "./presentation-menu-actions";

export function presentationMenuReducer(
    state: PresentationMenuState | undefined,
    action: PresentationMenuAction
): PresentationMenuState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case PresentationMenuActionType.InitializePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationMenuActionType.ChangePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.presentationSelected
            };
        case PresentationMenuActionType.ChangeDecimals:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber
            };
        case PresentationMenuActionType.ShowPartiesNoSeats:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationMenuActionType.SelectDistrict:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                districtSelected: action.districtSelected
            };
        case PresentationMenuActionType.ChangeDisproportionalityIndex:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                disproportionalityIndex: action.index
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            return state || unloadedState;
    }
}
