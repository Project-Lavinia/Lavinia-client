import { ComputationMenuActionType, ComputationMenuAction } from "./computation-menu-actions";
import { ComputationMenuState, unloadedState } from "./computation-menu-state";
import { checkExhaustively } from "../../utilities";

export function computationMenuReducer(
    state: ComputationMenuState = unloadedState,
    action: ComputationMenuAction
): ComputationMenuState {
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
            checkExhaustively(action);
            return state;
    }
}
