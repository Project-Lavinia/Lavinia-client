import { combineReducers } from "redux";
import { RootState } from "./state";
import { routerReducer, RouterState } from "react-router-redux";
import { computationReducer } from "../Layout/Computation";
import { settingsReducer } from "../Layout/ComputationSettings";
import { requestedDataAction } from "app/Layout/API";
import { presentationReducer } from "app/Layout/PresentationSettings";

export { RootState, RouterState };

// NOTE: current type definition of Reducer in 'react-router-redux' and 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  router: routerReducer as any,
  computationState: computationReducer,
  settingsState: settingsReducer,
  presentationState: presentationReducer,
  requestedDataState: requestedDataAction
});
