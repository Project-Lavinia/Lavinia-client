export interface UiState {
    hamburgerExpanded: boolean;
    showTutorial: boolean;
}

export const defaultState: UiState = {
    hamburgerExpanded: false,
    showTutorial: true,
};