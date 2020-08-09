import { ClearState, GlobalActionType } from "../reducers/global-actions";

export interface UiState {
    hamburgerExpanded: boolean;
}

const defaultState: UiState = {
    hamburgerExpanded: false,
};

export enum UiActionType {
    TOGGLE_HAMBURGER_EXPANDED = "TOGGLE_HAMBURGER_EXPANDED",
}

export type UiAction = ToggleHamburger | ClearState;

export function toggleHamburger(hamburgerExpanded: boolean) {
    const action: ToggleHamburger = {
        type: UiActionType.TOGGLE_HAMBURGER_EXPANDED,
        hamburgerExpanded: !hamburgerExpanded,
    };
    return action;
}

export interface ToggleHamburger {
    type: UiActionType.TOGGLE_HAMBURGER_EXPANDED;
    hamburgerExpanded: boolean;
}

export function ui(state: UiState = defaultState, action: UiAction): UiState {
    switch (action.type) {
        case UiActionType.TOGGLE_HAMBURGER_EXPANDED: {
            return {
                ...state,
                hamburgerExpanded: action.hamburgerExpanded,
            };
        }
        case GlobalActionType.CLEAR_STATE: {
            return defaultState;
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
