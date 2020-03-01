import { ElectionType, Parameters } from "../../requested-data/requested-data-models";
import { ComputationMenuPayload } from "./computation-menu-models";

/**
 * Enum containing all possible ComputationMenuAction types.
 */
export enum ComputationMenuActionType {
    INITIALIZE_COMPUTATION_MENU = "INITIALIZE_COMPUTATION_MENU",
    UPDATE_COMPUTATION_MENU = "UPDATE_COMPUTATION_MENU",
    TOGGLE_AUTO_COMPUTE = "TOGGLE_AUTO_COMPUTE",
    SAVE_SETTINGS = "SAVE_SETTINGS",
    RESET_SAVED_SETTINGS = "RESET_SAVED_SETTINGS",
}

/**
 * Type containing all possible ComputationMenuActions.
 */
export type ComputationMenuAction =
    | InitializeComputationMenu
    | UpdateComputationMenu
    | ToggleAutoCompute
    | SaveSettings
    | ResetSavedSettings;

/**
 * Action for initializing the computation menu.
 */
export interface InitializeComputationMenu {
    type: ComputationMenuActionType.INITIALIZE_COMPUTATION_MENU;
    electionYears: string[];
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
    areaFactor: string;
}

/**
 * Action creator for initializing the computation menu.
 *
 * @param electionType - election data fetched from the API.
 */
export function initializeComputationMenu(electionType: ElectionType, parameters: Parameters) {
    const electionYears: string[] = [];
    for (const currentElection of electionType.elections) {
        electionYears.push(currentElection.year.toString());
    }

    const action: InitializeComputationMenu = {
        type: ComputationMenuActionType.INITIALIZE_COMPUTATION_MENU,
        electionYears,
        year: parameters.electionYear.toString(),
        algorithm: parameters.algorithm.id,
        firstDivisor: parameters.algorithm.parameters["First Divisor"].toString(),
        electionThreshold: parameters.threshold.toString(),
        districtSeats: parameters.districtSeats.SUM.toString(),
        levelingSeats: parameters.levelingSeats.toString(),
        areaFactor: parameters.areaFactor.toString(),
        autoCompute: true,
    };
    return action;
}

/**
 * Action for updating the computation menu.
 */
export interface UpdateComputationMenu {
    type: ComputationMenuActionType.UPDATE_COMPUTATION_MENU;
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    areaFactor: string;
}

/**
 * Action creator for updating the computation menu.
 *
 * @param settingsPayload - the displayed parameters
 */
export function updateComputationMenu(settingsPayload: ComputationMenuPayload) {
    const action: UpdateComputationMenu = {
        type: ComputationMenuActionType.UPDATE_COMPUTATION_MENU,
        year: settingsPayload.year,
        algorithm: settingsPayload.algorithm,
        firstDivisor: settingsPayload.firstDivisor,
        electionThreshold: settingsPayload.electionThreshold,
        districtSeats: settingsPayload.districtSeats,
        levelingSeats: settingsPayload.levelingSeats,
        areaFactor: settingsPayload.areaFactor,
    };
    return action;
}

/**
 * Action for saving the current computation settings.
 */
export interface SaveSettings {
    type: ComputationMenuActionType.SAVE_SETTINGS;
}

/**
 * Action creator for saving the computation settings.
 */

export function saveSettings() {
    const action: SaveSettings = {
        type: ComputationMenuActionType.SAVE_SETTINGS,
    };
    return action;
}

/**
 * Action for resetting the computation settings to the saved settings.
 */
export interface ResetSavedSettings {
    type: ComputationMenuActionType.RESET_SAVED_SETTINGS;
}

/**
 * Action creator for resetting the computation settings to the saved settings.
 */

export function resetSavedSettings() {
    const action: ResetSavedSettings = {
        type: ComputationMenuActionType.RESET_SAVED_SETTINGS,
    };
    return action;
}

/**
 * Action for toggling auto computation.
 */
export interface ToggleAutoCompute {
    type: ComputationMenuActionType.TOGGLE_AUTO_COMPUTE;
    autoCompute: boolean;
}

/**
 * Action creator for toggling auto computation.
 *
 * @param autoCompute - true for computing automatically, else false
 */
export function toggleAutoCompute(autoCompute: boolean) {
    const action: ToggleAutoCompute = {
        type: ComputationMenuActionType.TOGGLE_AUTO_COMPUTE,
        autoCompute,
    };
    return action;
}
