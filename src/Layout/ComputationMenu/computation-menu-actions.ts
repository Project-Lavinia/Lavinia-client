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

export interface InitializeComputationMenuAction {
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

export function initializeComputationMenu(electionType: ElectionType) {
    const election = electionType.elections[0]; // Most recent election
    const electionYears: string[] = [];
    for (const currentElection of electionType.elections) {
        electionYears.push(currentElection.year.toString());
    }

    const initializeSettingsAction: InitializeComputationMenuAction = {
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
    return initializeSettingsAction;
}

export interface UpdateComputationMenuAction {
    type: ComputationMenuActionType.UpdateSettings;
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
}

export function updateComputationMenu(settingsPayload: ComputationMenuPayload) {
    const updateSettingsAction: UpdateComputationMenuAction = {
        type: ComputationMenuActionType.UpdateSettings,
        year: settingsPayload.year,
        algorithm: settingsPayload.algorithm,
        firstDivisor: settingsPayload.firstDivisor,
        electionThreshold: settingsPayload.electionThreshold,
        districtSeats: settingsPayload.districtSeats,
        levelingSeats: settingsPayload.levelingSeats
    };
    return updateSettingsAction;
}

export interface ToggleAutoComputeAction {
    type: ComputationMenuActionType.ToggleAutoCompute;
    autoCompute: boolean;
}

export function toggleAutoCompute(autoCompute: boolean) {
    const toggleAutoComputeAction: ToggleAutoComputeAction = {
        type: ComputationMenuActionType.ToggleAutoCompute,
        autoCompute
    };
    return toggleAutoComputeAction;
}
