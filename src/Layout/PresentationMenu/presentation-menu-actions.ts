import { PresentationType } from "../Presentation/presentation-models";

export enum PresentationMenuAction {
    InitializePresentation = "INITIALIZE_PRESENTATION",
    ChangePresentation = "CHANGE_PRESENTATION",
    ChangeDecimals = "CHANGE_DECIMALS",
    ShowPartiesNoSeats = "SHOW_PARTIES_WITH_NO_SEATS",
    SelectDistrict = "SELECT_DISTRICT"
}

export interface ChangePresentationAction {
    type: PresentationMenuAction.ChangePresentation;
    presentationSelected: PresentationType;
}
export interface InitializePresentationAction {
    type: PresentationMenuAction.InitializePresentation;
    initialPresentation: PresentationType;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
}
export interface ChangeDecimalsAction {
    type: PresentationMenuAction.ChangeDecimals;
    decimals: string;
    decimalsNumber: number;
}
export interface ChangeShowPartiesNoSeats {
    type: PresentationMenuAction.ShowPartiesNoSeats;
    showPartiesWithoutSeats: boolean;
}

export interface SelectDistrictAction {
    type: PresentationMenuAction.SelectDistrict;
    districtSelected: string;
}

export function initializePresentation(): InitializePresentationAction {
    const action: InitializePresentationAction = {
        type: PresentationMenuAction.InitializePresentation,
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
        type: PresentationMenuAction.ChangePresentation,
        presentationSelected
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
export function selectDistrict(name: string): SelectDistrictAction {
    const action: SelectDistrictAction = {
        type: PresentationMenuAction.SelectDistrict,
        districtSelected: name
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
