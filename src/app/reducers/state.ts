import { RouterState } from "react-router-redux";
import { ComputationState } from "../Layout/Computation";
import { SettingsState } from "../Layout/ComputationSettings";
import { RequestedDataState } from "../Layout/API";
import { PresentationState } from "../Layout/PresentationSettings";

export interface RootState {
  router: RouterState;
  computationState: ComputationState;
  settingsState: SettingsState;
  requestedDataState: RequestedDataState;
  presentationState: PresentationState;
}
