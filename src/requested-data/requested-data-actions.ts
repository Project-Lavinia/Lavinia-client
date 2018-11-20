import { ElectionType } from "./requested-data-models";

/**
 * Enum containing all possible RequestedDataAction types.
 */
export enum RequestedDataActionType {
    InitializeRequestedData = "INITIALIZE_REQUESTED_DATA"
}

export interface InitializeRequestedDataAction {
    type: RequestedDataActionType.InitializeRequestedData;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

export function initializeRequestedData(electionType: ElectionType): InitializeRequestedDataAction {
    const action: InitializeRequestedDataAction = {
        type: RequestedDataActionType.InitializeRequestedData,
        electionType,
        enableAutoSave: true
    };
    return action;
}
