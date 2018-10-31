import { ElectionType } from "./requested-data-models";

export enum RequestedDataAction {
    InitializeRequestedData = "INITIALIZE_REQUESTED_DATA"
}

export interface InitializeRequestedDataAction {
    type: RequestedDataAction.InitializeRequestedData;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

export function initializeRequestedData(electionType: ElectionType): InitializeRequestedDataAction {
    const action: InitializeRequestedDataAction = {
        type: RequestedDataAction.InitializeRequestedData,
        electionType,
        enableAutoSave: true
    };
    return action;
}
