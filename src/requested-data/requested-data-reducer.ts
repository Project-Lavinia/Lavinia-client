import { RequestedDataActionType, RequestedDataAction } from "./requested-data-actions";
import { RequestedDataState, unloadedState } from "./requested-data-state";

export function requestedData(
    state: RequestedDataState = unloadedState,
    action: RequestedDataAction
): RequestedDataState {
    switch (action.type) {
        case RequestedDataActionType.InitializeRequestedData:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                electionType: action.electionType,
                enableAutoSave: true
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            return state;
    }
}
