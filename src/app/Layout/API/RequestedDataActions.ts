import { RequestedDataAction } from "../Types/ActionTypes";
import { ElectionType } from "../Interfaces/Models";

export interface InitializeRequestedDataAction {
    type: RequestedDataAction.InitializeRequestedData;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

export function initializeRequestedData(electionType: ElectionType): InitializeRequestedDataAction {
    const action: InitializeRequestedDataAction = {
        type: RequestedDataAction.InitializeRequestedData,
        electionType,
        enableAutoSave: true,
    };
    return action;
}