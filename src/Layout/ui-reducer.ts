import { GlobalActionType } from "../reducers/global-actions";
import { UiState, defaultState } from "./ui-state";
import { UiAction, UiActionType } from "./ui-actions";

export function ui(state: UiState = defaultState, action: UiAction): UiState {
    switch (action.type) {
        case UiActionType.TOGGLE_HAMBURGER_EXPANDED: {
            return {
                ...state,
                hamburgerExpanded: action.hamburgerExpanded,
            };
        }
        case UiActionType.HIDE_TUTORIAL: {
            return {
                ...state,
                showTutorial: false,
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
