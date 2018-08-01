import { InitializeSettingsAction, UpdateSettingsAction, ToggleAutoComputeAction } from "./SettingActions";
import { SettingsState, unloadedState } from "./SettingsState";
import { SettingAction } from "../Types/ActionTypes";

// TODO: Make actions for updates of elections etc...

type KnownAction = InitializeSettingsAction | UpdateSettingsAction | ToggleAutoComputeAction;

export function settingsReducer(state: SettingsState | undefined, action: KnownAction): SettingsState {
    if (state === undefined) {
        state = unloadedState;
    }

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
            };
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
            };
        case SettingAction.ToggleAutoCompute:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                autoCompute: action.autoCompute
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            return state || unloadedState;
    }
}
