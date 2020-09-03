import { PresentationType, DisproportionalityIndex } from "../Presentation/presentation-models";
import { ClearState } from "../../reducers/global-actions";

/**
 * Enum containing all possible PresentationMenuAction types.
 */
export enum PresentationMenuActionType {
    INITIALIZE_PRESENTATION = "INITIALIZE_PRESENTATION",
    CHANGE_PRESENTATION = "CHANGE_PRESENTATION",
    CHANGE_DECIMALS = "CHANGE_DECIMALS",
    SHOW_PARTIES_NO_SEATS = "SHOW_PARTIES_NO_SEATS",
    SELECT_DISTRICT = "SELECT_DISTRICT",
    SELECT_PARTY = "SELECT_PARTY",
    CHANGE_DISPROPORTIONALITY_INDEX = "CHANGE_DISPROPORTIONALITY_INDEX",
    TOGGLE_SHOW_COMPARISON = "TOGGLE_SHOW_COMPARISON",
    TOGGLE_SHOW_FILTERS = "TOGGLE_SHOW_FILTERS",
    TOGGLE_MERGE_DISTRICTS = "TOGGLE_MERGE_DISTRICTS",
    TOGGLE_USE_2021_DISTRIBUTION = "TOGGLE_USE_2021_DISTRIBUTION",
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
    | SelectParty
    | ChangeDisproportionalityIndex
    | ToggleShowComparison
    | ToggleShowFilters
    | ToggleMergeDistricts
    | ToggleUse2021Distribution
    | ClearState;

/**
 * Action for initializing the presentation.
 */
export interface InitializePresentation {
    type: PresentationMenuActionType.INITIALIZE_PRESENTATION;
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
        type: PresentationMenuActionType.INITIALIZE_PRESENTATION,
        initialPresentation: PresentationType.ElectionTable,
        decimals: "2",
        decimalsNumber: 2,
        showPartiesWithoutSeats: true,
    };
    return action;
}

/**
 * Action for changing the presentation.
 */
export interface ChangePresentation {
    type: PresentationMenuActionType.CHANGE_PRESENTATION;
    presentationSelected: PresentationType;
}

/**
 * Action creator for changing the presentation.
 *
 * @param presentationSelected - presentation to change to.
 */
export function changePresentation(presentationSelected: PresentationType): ChangePresentation {
    const action: ChangePresentation = {
        type: PresentationMenuActionType.CHANGE_PRESENTATION,
        presentationSelected,
    };
    return action;
}

/**
 * Action for changing displayed decimals.
 */
export interface ChangeDecimals {
    type: PresentationMenuActionType.CHANGE_DECIMALS;
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
        type: PresentationMenuActionType.CHANGE_DECIMALS,
        decimals,
        decimalsNumber,
    };
    return action;
}

/**
 * Action for changing whether parties with no seats are shown.
 */
export interface ChangeShowPartiesNoSeats {
    type: PresentationMenuActionType.SHOW_PARTIES_NO_SEATS;
    showPartiesWithoutSeats: boolean;
}

/**
 * Action creator for changing whether parties with no seats are shown.
 *
 * @param showPartiesNoSeats - true if showing parties with no seats, else false.
 */
export function changeShowPartiesNoSeats(showPartiesNoSeats: boolean) {
    const action: ChangeShowPartiesNoSeats = {
        type: PresentationMenuActionType.SHOW_PARTIES_NO_SEATS,
        showPartiesWithoutSeats: showPartiesNoSeats,
    };
    return action;
}

/**
 * Action for selecting which district should be displayed.
 */
export interface SelectDistrict {
    type: PresentationMenuActionType.SELECT_DISTRICT;
    districtSelected: string;
}

/**
 * Action for selecting which party should be displayed.
 */
export interface SelectParty {
    type: PresentationMenuActionType.SELECT_PARTY;
    partySelected: string;
}

/**
 * Action creator for selecting which district should be displayed.
 *
 * @param name - name of district to be displayed.
 */
export function selectDistrict(name: string): SelectDistrict {
    const action: SelectDistrict = {
        type: PresentationMenuActionType.SELECT_DISTRICT,
        districtSelected: name,
    };
    return action;
}

/**
 * Action creator for selecting which party should be displayed.
 *
 * @param partyCode - party code of party to be displayed.
 */
export function selectParty(partyCode: string): SelectParty {
    const action: SelectParty = {
        type: PresentationMenuActionType.SELECT_PARTY,
        partySelected: partyCode,
    };
    return action;
}

/**
 * Action for changing which disproportionality index to use.
 */
export interface ChangeDisproportionalityIndex {
    type: PresentationMenuActionType.CHANGE_DISPROPORTIONALITY_INDEX;
    index: DisproportionalityIndex;
}

/**
 * Action creator for changing which disproportionality index to use.
 *
 * @param index - which index to use.
 */
export function changeDisproportionalityIndex(index: DisproportionalityIndex) {
    const action: ChangeDisproportionalityIndex = {
        type: PresentationMenuActionType.CHANGE_DISPROPORTIONALITY_INDEX,
        index,
    };
    return action;
}

/**
 * Action for changing whether to show comparison or not.
 */
export interface ToggleShowComparison {
    type: PresentationMenuActionType.TOGGLE_SHOW_COMPARISON;
    showComparison: boolean;
}

/**
 * Action creator for changing whether to show comparison or not.
 *
 * @param showComparison - true if to show comparison, else false
 */
export function toggleShowComparison(showComparison: boolean) {
    const action: ToggleShowComparison = {
        type: PresentationMenuActionType.TOGGLE_SHOW_COMPARISON,
        showComparison,
    };
    return action;
}

/**
 * Action for toggling filters' visibility.
 */
export interface ToggleShowFilters {
    type: PresentationMenuActionType.TOGGLE_SHOW_FILTERS;
    showFilters: boolean;
}

/**
 * Action creator for toggling filters' visibility.
 *
 * @param showFilters - true if filters visible, else false.
 */
export function toggleShowFilters(showFilters: boolean) {
    const action: ToggleShowFilters = {
        type: PresentationMenuActionType.TOGGLE_SHOW_FILTERS,
        showFilters,
    };
    return action;
}

/**
 * Action for toggling whether or not to merge districts.
 */
export interface ToggleMergeDistricts {
    type: PresentationMenuActionType.TOGGLE_MERGE_DISTRICTS;
    mergeDistricts: boolean;
}

/**
 * Action creator for toggling whether or not to merge districts.
 *
 * @param mergeDistricts - true if districts should be merged, else false.
 */
export function toggleMergeDistricts(mergeDistricts: boolean) {
    const action: ToggleMergeDistricts = {
        type: PresentationMenuActionType.TOGGLE_MERGE_DISTRICTS,
        mergeDistricts,
    };
    return action;
}

/**
 * Action for toggling whether or not to merge districts.
 */
export interface ToggleUse2021Distribution {
    type: PresentationMenuActionType.TOGGLE_USE_2021_DISTRIBUTION;
    use2021Distribution: boolean;
}

/**
 * Action creator for toggling whether or not to merge districts.
 *
 * @param mergeDistricts - true if districts should be merged, else false.
 */
export function toggleUse2021Distribution(use2021Distribution: boolean) {
    const action: ToggleUse2021Distribution = {
        type: PresentationMenuActionType.TOGGLE_USE_2021_DISTRIBUTION,
        use2021Distribution,
    };
    return action;
}
