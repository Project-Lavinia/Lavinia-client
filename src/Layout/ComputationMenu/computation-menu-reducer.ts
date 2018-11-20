import {
    InitializeComputationMenu,
    UpdateComputationMenu,
    ToggleAutoCompute,
    ComputationMenuActionType
} from "./computation-menu-actions";
import { ComputationMenuState, unloadedState } from "./computation-menu-state";

type KnownAction = InitializeComputationMenu | UpdateComputationMenu | ToggleAutoCompute;

export function computationMenuReducer(
    state: ComputationMenuState | undefined,
    action: KnownAction
): ComputationMenuState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case ComputationMenuActionType.InitializeComputationMenu:
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
        case ComputationMenuActionType.UpdateComputationMenu:
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
        case ComputationMenuActionType.ToggleAutoCompute:
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
