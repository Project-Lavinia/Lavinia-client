export enum GlobalActionType {
    CLEAR_STATE = "CLEAR_STATE",
}

export function clearState() {
    const action: ClearState = {
        type: GlobalActionType.CLEAR_STATE,
    };
    return action;
}

export interface ClearState {
    type: GlobalActionType.CLEAR_STATE;
}