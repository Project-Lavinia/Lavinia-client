import { ElectionType } from "../../requested-data/requested-data-models";
import { ComputationMenuPayload } from "./computation-menu-models";

/**
 * Enum containing all possible ComputationMenuAction types.
 */
export enum ComputationMenuActionType {
    InitializeSettings = "INITIALIZE_SETTINGS",
    UpdateSettings = "UPDATE_SETTINGS",
    ToggleAutoCompute = "TOGGLE_AUTO_COMPUTE"
}

/**
 * Action for initializing the computation menu.
 */
export interface InitializeComputationMenu {
    type: ComputationMenuActionType.InitializeSettings;
    electionYears: string[];
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
}

/**
 * Action creator for initializing the computation menu.
 *
 * @param electionType - election data fetched from the API.
 */
export function initializeComputationMenu(electionType: ElectionType) {
    const election = electionType.elections[0]; // Most recent election
    const electionYears: string[] = [];
    for (const currentElection of electionType.elections) {
        electionYears.push(currentElection.year.toString());
    }

    const action: InitializeComputationMenu = {
        type: ComputationMenuActionType.InitializeSettings,
        electionYears,
        year: election.year.toString(),
        algorithm: election.algorithm,
        firstDivisor: election.firstDivisor.toString(),
        electionThreshold: election.threshold.toString(),
        districtSeats: election.seats.toString(),
        levelingSeats: election.levelingSeats.toString(),
        autoCompute: true
    };
    return action;
}

/**
 * Action for updating the computation menu.
 */
export interface UpdateComputationMenu {
    type: ComputationMenuActionType.UpdateSettings;
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
}

/**
 * Action creator for updating the computation menu.
 *
 * @param settingsPayload - the displayed parameters
 */
export function updateComputationMenu(settingsPayload: ComputationMenuPayload) {
    const action: UpdateComputationMenu = {
        type: ComputationMenuActionType.UpdateSettings,
        year: settingsPayload.year,
        algorithm: settingsPayload.algorithm,
        firstDivisor: settingsPayload.firstDivisor,
        electionThreshold: settingsPayload.electionThreshold,
        districtSeats: settingsPayload.districtSeats,
        levelingSeats: settingsPayload.levelingSeats
    };
    return action;
}

/**
 * Action for toggling auto computation.
 */
export interface ToggleAutoCompute {
    type: ComputationMenuActionType.ToggleAutoCompute;
    autoCompute: boolean;
}

/**
 * Action creator for toggling auto computation.
 *
 * @param autoCompute - true for computing automatically, else false
 */
export function toggleAutoCompute(autoCompute: boolean) {
    const action: ToggleAutoCompute = {
        type: ComputationMenuActionType.ToggleAutoCompute,
        autoCompute
    };
    return action;
}
