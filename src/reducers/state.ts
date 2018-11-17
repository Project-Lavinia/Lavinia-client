import { RouterState } from "react-router-redux";
import { ComputationState } from "../computation";
import { RequestedDataState } from "../requested-data";
import { ComputationMenuState } from "../Layout/ComputationMenu";
import { PresentationMenuState } from "../Layout/PresentationMenu";

export interface RootState {
    router: RouterState;
    computationState: ComputationState;
    settingsState: ComputationMenuState;
    requestedDataState: RequestedDataState;
    presentationMenuState: PresentationMenuState;
}
