import { PresentationType, DisproportionalityIndex } from "../Presentation/presentation-models";

/**
 * Enum containing all possible PresentationMenuAction types.
 */
export enum PresentationMenuActionType {
    InitializePresentation = "INITIALIZE_PRESENTATION",
    ChangePresentation = "CHANGE_PRESENTATION",
    ChangeDecimals = "CHANGE_DECIMALS",
    ShowPartiesNoSeats = "SHOW_PARTIES_WITH_NO_SEATS",
    SelectDistrict = "SELECT_DISTRICT",
    ChangeDisproportionalityIndex = "CHANGE_DISPROPORTIONALITY_INDEX"
}

/**
 * Type containing all possible PresentationMenuActions.
 */
export type PresentationMenuAction =
    | InitializePresentation
    | ChangePresentation
    | ChangeDecimals
    | ChangeShowPartiesNoSeats
    | SelectDistrict
    | ChangeDisproportionalityIndex;

/**
 * Action for initializing the presentation.
 */
export interface InitializePresentation {
    type: PresentationMenuActionType.InitializePresentation;
    initialPresentation: PresentationType;
    decimals: string;
    decimalsNumber: number;
    showPartiesWithoutSeats: boolean;
}

/**
 * Action creator for initializing the presentation.
 */
export function initializePresentation(): InitializePresentation {
    const action: InitializePresentation = {
        type: PresentationMenuActionType.InitializePresentation,
        initialPresentation: PresentationType.ElectionTable,
        decimals: "2",
        decimalsNumber: 2,
        showPartiesWithoutSeats: false
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}

/**
 * Action for changing the presentation.
 */
export interface ChangePresentation {
    type: PresentationMenuActionType.ChangePresentation;
    presentationSelected: PresentationType;
}

/**
 * Action creator for changing the presentation.
 *
 * @param presentationSelected - presentation to change to.
 */
export function changePresentation(presentationSelected: PresentationType): ChangePresentation {
    const action: ChangePresentation = {
        type: PresentationMenuActionType.ChangePresentation,
        presentationSelected
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}

/**
 * Action for changing displayed decimals.
 */
export interface ChangeDecimals {
    type: PresentationMenuActionType.ChangeDecimals;
    decimals: string;
    decimalsNumber: number;
}

/**
 * Action creator for changing displayed decimals.
 *
 * @param decimals - number of decimals as string.
 * @param decimalsNumber - number of decimals.
 */
export function changeDecimals(decimals: string, decimalsNumber: number) {
    const action: ChangeDecimals = {
        type: PresentationMenuActionType.ChangeDecimals,
        decimals,
        decimalsNumber
    };
    return action;
}

/**
 * Action for changing whether parties with no seats are shown.
 */
export interface ChangeShowPartiesNoSeats {
    type: PresentationMenuActionType.ShowPartiesNoSeats;
    showPartiesWithoutSeats: boolean;
}

/**
 * Action creator for changing whether parties with no seats are shown.
 *
 * @param showPartiesNoSeats - true if showing parties with no seats, else false.
 */
export function changeShowPartiesNoSeats(showPartiesNoSeats: boolean) {
    const action: ChangeShowPartiesNoSeats = {
        type: PresentationMenuActionType.ShowPartiesNoSeats,
        showPartiesWithoutSeats: showPartiesNoSeats
    };
    return action;
}

/**
 * Action for selecting which district should be displayed.
 */
export interface SelectDistrict {
    type: PresentationMenuActionType.SelectDistrict;
    districtSelected: string;
}

/**
 * Action creator for selecting which district should be displayed.
 *
 * @param name - name of district to be displayed.
 */
export function selectDistrict(name: string): SelectDistrict {
    const action: SelectDistrict = {
        type: PresentationMenuActionType.SelectDistrict,
        districtSelected: name
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}

/**
 * Action for changing which disproportionality index to use.
 */
export interface ChangeDisproportionalityIndex {
    type: PresentationMenuActionType.ChangeDisproportionalityIndex;
    index: DisproportionalityIndex;
}

/**
 * Action creator for changing which disproportionality index to use.
 *
 * @param index - which index to use.
 */
export function changeDisproportionalityIndex(index: DisproportionalityIndex) {
    const action: ChangeDisproportionalityIndex = {
        type: PresentationMenuActionType.ChangeDisproportionalityIndex,
        index
    };
    console.log(`Action of type ${action.type} created`);
    return action;
}
