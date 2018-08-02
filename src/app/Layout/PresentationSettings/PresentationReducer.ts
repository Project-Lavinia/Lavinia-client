import { unloadedState, PresentationState } from "./PresentationState";
import { PresentationAction as KnownAction } from "./PresentationActions";
import { PresentationAction } from "../Types/ActionTypes";

export function presentationReducer(state: PresentationState | undefined, action: KnownAction): PresentationState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case PresentationAction.InitializePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationAction.ChangePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.presentationSelected
            };
        case PresentationAction.ChangeDecimals:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber
            };
        case PresentationAction.ShowPartiesNoSeats:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            };
        case PresentationAction.SelectDistrict:
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
