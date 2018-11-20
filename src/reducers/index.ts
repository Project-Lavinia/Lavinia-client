import { combineReducers } from "redux";
import { RootState } from "./state";
import { routerReducer, RouterState } from "react-router-redux";
import { computation } from "../computation";
import { requestedDataAction } from "../requested-data";
import { computationMenu } from "../Layout/ComputationMenu";
import { presentationMenu } from "../Layout/PresentationMenu";

export { RootState, RouterState };

// NOTE: current type definition of Reducer in 'react-router-redux' and 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
    router: routerReducer as any,
    computationState: computation,
    settingsState: computationMenu,
    presentationMenuState: presentationMenu,
    requestedDataState: requestedDataAction
});
