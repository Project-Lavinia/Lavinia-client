import { unloadedState, PresentationState } from "./PresentationState";
import { Action } from "redux";
import { PresentationAction as KnownAction } from "./PresentationActions";
import { PresentationAction } from "../Types/ActionTypes";

export function presentationReducer (state: PresentationState | undefined, incomingAction: Action) {
    if (state === undefined) {
        state = unloadedState;
    }
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case PresentationAction.InitializePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.initialPresentation,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            } as PresentationState;
        case PresentationAction.ChangePresentation:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                currentPresentation: action.presentationSelected
            } as PresentationState;
        case PresentationAction.ChangeDecimals:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                decimals: action.decimals,
                decimalsNumber: action.decimalsNumber
            } as PresentationState;
        case PresentationAction.ShowPartiesNoSeats:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                showPartiesWithoutSeats: action.showPartiesWithoutSeats
            } as PresentationState;
        default:
            console.log(`Action of type ${incomingAction.type} reduced to default`);
            return state || unloadedState;
    }
}