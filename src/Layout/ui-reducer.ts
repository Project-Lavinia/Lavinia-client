export interface UiState {
    hamburgerExpanded: boolean;
    showTutorial: boolean;
}

const defaultState: UiState = {
    hamburgerExpanded: false,
    showTutorial: true,
};

export enum UiActionType {
    TOGGLE_HAMBURGER_EXPANDED = "TOGGLE_HAMBURGER_EXPANDED",
    HIDE_TUTORIAL = "HIDE_TUTORIAL",
}

export type UiAction = ToggleHamburger | HideTutorial;

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

export function hideTutorial() {
    const action: HideTutorial  = {
        type: UiActionType.HIDE_TUTORIAL
    }
    return action;
}

export interface HideTutorial {
    type: UiActionType.HIDE_TUTORIAL;
}

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
        default: {
            return {
                ...state,
            };
        }
    }
}
