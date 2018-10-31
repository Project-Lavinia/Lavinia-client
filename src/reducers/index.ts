import { combineReducers } from "redux";
import { RootState } from "./state";
import { routerReducer, RouterState } from "react-router-redux";
import { computationReducer } from "../computation";
import { requestedDataAction } from "../requested-data";
import { computationMenuReducer } from "../Layout/ComputationMenu";
import { presentationMenuReducer } from "../Layout/PresentationMenu";

export { RootState, RouterState };

// NOTE: current type definition of Reducer in 'react-router-redux' and 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
    router: routerReducer as any,
    computationState: computationReducer,
    settingsState: computationMenuReducer,
    presentationMenuState: presentationMenuReducer,
    requestedDataState: requestedDataAction
});
