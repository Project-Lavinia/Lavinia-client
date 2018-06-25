import { Action } from "redux";
import { InitializeSettingsAction, UpdateSettingsAction, ToggleAutoComputeAction } from "./SettingActions";
import { SettingsState, unloadedState } from "./SettingsState";
import { SettingAction } from "../Types/ActionTypes";

// TODO: Make actions for updates of elections etc...

type KnownAction = InitializeSettingsAction
    | UpdateSettingsAction
    | ToggleAutoComputeAction;

// NB: BaseReducer Typescript (Reducer<State>) definition changes as of redux 4.0.0
// https://github.com/rt2zz/redux-persist/pull/778

export function settingsReducer (state: SettingsState | undefined, incomingAction: Action) {
    if (state == undefined) {
        state = unloadedState;
    }
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SettingAction.InitializeSettings:
        console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                electionYears: action.electionYears,
                year: action.year,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                autoCompute: action.autoCompute
            } as SettingsState;
        case SettingAction.UpdateSettings:
        console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                year: action.year,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats
            } as SettingsState;
        case SettingAction.ToggleAutoCompute:
        console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                autoCompute: action.autoCompute
            } as SettingsState;
        default:
            console.log(`Action of type ${incomingAction.type} reduced to default`);
            return state || unloadedState;
    }
}