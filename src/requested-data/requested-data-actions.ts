import { ElectionType } from "./requested-data-models";

/**
 * Enum containing all possible RequestedDataAction types.
 */
export enum RequestedDataActionType {
    InitializeRequestedData = "INITIALIZE_REQUESTED_DATA"
}

export interface InitializeRequestedData {
    type: RequestedDataActionType.InitializeRequestedData;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

export function initializeRequestedData(electionType: ElectionType): InitializeRequestedData {
    const action: InitializeRequestedData = {
        type: RequestedDataActionType.InitializeRequestedData,
        electionType,
        enableAutoSave: true
    };
    return action;
}
