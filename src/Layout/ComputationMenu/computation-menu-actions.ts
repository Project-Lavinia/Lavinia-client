import { ElectionType } from "../../requested-data/requested-data-models";
import { ComputationMenuPayload } from "./computation-menu-models";

export enum ComputationMenuAction {
    InitializeSettings = "INITIALIZE_SETTINGS",
    UpdateSettings = "UPDATE_SETTINGS",
    ToggleAutoCompute = "TOGGLE_AUTO_COMPUTE"
}
export interface InitializeComputationMenuAction {
    type: ComputationMenuAction.InitializeSettings;
    electionYears: string[];
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
}

export interface UpdateComputationMenuAction {
    type: ComputationMenuAction.UpdateSettings;
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
}

export interface ToggleAutoComputeAction {
    type: ComputationMenuAction.ToggleAutoCompute;
    autoCompute: boolean;
}

export function initializeComputationMenu(electionType: ElectionType) {
    const election = electionType.elections[0]; // Most recent election
    const electionYears: string[] = [];
    for (const currentElection of electionType.elections) {
        electionYears.push(currentElection.year.toString());
    }

    const initializeSettingsAction: InitializeComputationMenuAction = {
        type: ComputationMenuAction.InitializeSettings,
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

export function updateComputationMenu(settingsPayload: ComputationMenuPayload) {
    const updateSettingsAction: UpdateComputationMenuAction = {
        type: ComputationMenuAction.UpdateSettings,
        year: settingsPayload.year,
        algorithm: settingsPayload.algorithm,
        firstDivisor: settingsPayload.firstDivisor,
        electionThreshold: settingsPayload.electionThreshold,
        districtSeats: settingsPayload.districtSeats,
        levelingSeats: settingsPayload.levelingSeats
    };
    return updateSettingsAction;
}

export function toggleAutoCompute(autoCompute: boolean) {
    const toggleAutoComputeAction: ToggleAutoComputeAction = {
        type: ComputationMenuAction.ToggleAutoCompute,
        autoCompute
    };
    return toggleAutoComputeAction;
}
