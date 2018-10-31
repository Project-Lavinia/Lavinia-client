import { RouterState } from "react-router-redux";
import { ComputationState } from "../computation";
import { RequestedDataState } from "../requested-data";
import { PresentationState } from "../Layout/PresentationSettings";
import { ComputationMenuState } from "../Layout/ComputationMenu";

export interface RootState {
    router: RouterState;
    computationState: ComputationState;
    settingsState: ComputationMenuState;
    requestedDataState: RequestedDataState;
    presentationState: PresentationState;
}
