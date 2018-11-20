import { InitializeRequestedDataAction, RequestedDataActionType } from "./requested-data-actions";
import { RequestedDataState, unloadedState } from "./requested-data-state";

type KnownAction = InitializeRequestedDataAction;

export function requestedDataAction(state: RequestedDataState | undefined, action: KnownAction): RequestedDataState {
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
