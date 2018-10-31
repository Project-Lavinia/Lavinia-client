import { RouterState } from "react-router-redux";
import { ComputationState } from "../computation";
import { SettingsState } from "../Layout/ComputationSettings";
import { RequestedDataState } from "../requested-data";
import { PresentationState } from "../Layout/PresentationSettings";

export interface RootState {
    router: RouterState;
    computationState: ComputationState;
    settingsState: SettingsState;
    requestedDataState: RequestedDataState;
    presentationState: PresentationState;
}
