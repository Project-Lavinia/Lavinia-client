import { ComputationState } from "../computation";
import { RequestedDataState } from "../requested-data";
import { ComputationMenuState } from "../Layout/ComputationMenu";
import { PresentationMenuState } from "../Layout/PresentationMenu";
import { UiState } from "../Layout/ui-reducer";

export interface RootState {
    computationState: ComputationState;
    settingsState: ComputationMenuState;
    requestedDataState: RequestedDataState;
    presentationMenuState: PresentationMenuState;
    uiState: UiState;
}
