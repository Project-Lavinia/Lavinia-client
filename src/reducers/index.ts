import { combineReducers } from "redux";
import { RootState } from "./state";
import { computation } from "../computation";
import { requestedData } from "../requested-data";
import { computationMenu } from "../Layout/ComputationMenu";
import { presentationMenu } from "../Layout/PresentationMenu";
import { ui } from "../Layout/ui-reducer";

export { RootState };

export const rootReducer = combineReducers<RootState>({
    computationState: computation,
    settingsState: computationMenu,
    presentationMenuState: presentationMenu,
    requestedDataState: requestedData,
    uiState: ui,
});
