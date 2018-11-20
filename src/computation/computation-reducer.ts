import { ComputationState, unloadedState } from "./computation-state";
import { InitializeComputation, UpdateComputation, ComputationActionType } from "./computation-actions";
import { checkExhaustively } from "../utilities";

type KnownAction = InitializeComputation | UpdateComputation;

export function computationReducer(state: ComputationState | undefined, action: KnownAction): ComputationState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case ComputationActionType.INITIALIZE_COMPUTATION:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                results: action.results
            };
        case ComputationActionType.UPDATE_COMPUTATION:
            console.log(`Action of type ${action.type} reduced`);
            return {
                ...state,
                election: action.election,
                algorithm: action.algorithm,
                firstDivisor: action.firstDivisor,
                electionThreshold: action.electionThreshold,
                districtSeats: action.districtSeats,
                levelingSeats: action.levelingSeats,
                results: action.results
            };
        default:
            console.log(`Action of type ${action!.type} reduced to default`);
            checkExhaustively(action);
            return state;
    }
}
