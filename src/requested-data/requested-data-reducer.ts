import { RequestedDataActionType, RequestedDataAction } from "./requested-data-actions";
import { RequestedDataState, unloadedState } from "./requested-data-state";

export function requestedDataAction(
    state: RequestedDataState | undefined,
    action: RequestedDataAction
): RequestedDataState {
    if (state === undefined) {
        state = unloadedState;
    }

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
            return state || unloadedState;
    }
}
