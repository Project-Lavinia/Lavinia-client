import { unloadedState, PresentationMenuState } from "./presentation-menu-state";
import {
    PresentationMenuAction,
    InitializePresentationAction,
    ChangePresentationAction,
    ChangeDecimalsAction,
    ChangeShowPartiesNoSeats,
    SelectDistrictAction
} from "./presentation-menu-actions";

type KnownAction =
    | InitializePresentationAction
    | ChangePresentationAction
    | ChangeDecimalsAction
    | ChangeShowPartiesNoSeats
    | SelectDistrictAction;

export function presentationMenuReducer(
    state: PresentationMenuState | undefined,
    action: KnownAction
): PresentationMenuState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case PresentationMenuAction.InitializePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationMenuAction.ChangePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.presentationSelected
            };
        case PresentationMenuAction.ChangeDecimals:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber
            };
        case PresentationMenuAction.ShowPartiesNoSeats:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationMenuAction.SelectDistrict:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                districtSelected: action.districtSelected
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            return state || unloadedState;
    }
}
