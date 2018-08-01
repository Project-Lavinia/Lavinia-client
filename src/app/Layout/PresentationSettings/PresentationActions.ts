import { PresentationAction, PresentationType } from "../Types";

export interface ChangePresentationAction {
    type: PresentationAction.ChangePresentation;
    presentationSelected: PresentationType;
}
export interface InitializePresentationAction {
    type: PresentationAction.InitializePresentation;
    initialPresentation: PresentationType;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
}
export interface ChangeDecimalsAction {
    type: PresentationAction.ChangeDecimals;
    decimals: string;
    decimalsNumber: number;
}
export interface ChangeShowPartiesNoSeat {
    type: PresentationAction.ShowPartiesNoSeats;
    showPartiesWithoutSeats: boolean;
}

export interface SelectDistrictAction {
    type: PresentationAction.SelectDistrict;
    districtSelected: string;
}

export type PresentationAction =
    | ChangePresentationAction
    | InitializePresentationAction
    | ChangeDecimalsAction
    | ChangeShowPartiesNoSeat
    | SelectDistrictAction;

export function initializePresentation(): InitializePresentationAction {
    const action: InitializePresentationAction = {
        type: PresentationAction.InitializePresentation,
        initialPresentation: PresentationType.ElectionTable,
        decimals: "2",
        decimalsNumber: 2,
        showPartiesWithoutSeats: false
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
export function changePresentation(presentationSelected: PresentationType): ChangePresentationAction {
    const action: ChangePresentationAction = {
        type: PresentationAction.ChangePresentation,
        presentationSelected
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
export function selectDistrict(name: string): SelectDistrictAction {
    const action: SelectDistrictAction = {
        type: PresentationAction.SelectDistrict,
        districtSelected: name
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
