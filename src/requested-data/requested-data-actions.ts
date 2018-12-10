import { ElectionType } from "./requested-data-models";

/**
 * Enum containing all possible RequestedDataAction types.
 */
export enum RequestedDataActionType {
    INITIALIZE_REQUESTED_DATA = "INITIALIZE_REQUESTED_DATA",
}

/**
 * Type containing all possible RequestedDataActions.
 */
export type RequestedDataAction = InitializeRequestedData;

/**
 * Action for initializing requested data.
 */
export interface InitializeRequestedData {
    type: RequestedDataActionType.INITIALIZE_REQUESTED_DATA;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

/**
 * Action creator for initializing requested data.
 *
 * @param electionType - election data fetched from the API.
 */
export function initializeRequestedData(electionType: ElectionType) {
    const action: InitializeRequestedData = {
        type: RequestedDataActionType.INITIALIZE_REQUESTED_DATA,
        electionType,
        enableAutoSave: true,
    };
    return action;
}
