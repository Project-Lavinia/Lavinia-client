import { InitializeRequestedDataAction } from "./RequestedDataActions";
import { RequestedDataState, unloadedState } from "./RequestedDataState";
import { RequestedDataAction } from "../Types/ActionTypes";

type KnownAction = InitializeRequestedDataAction;

export function requestedDataAction(state: RequestedDataState | undefined, action: KnownAction): RequestedDataState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case RequestedDataAction.InitializeRequestedData:
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
