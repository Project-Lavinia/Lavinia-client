import { ComputationState, unloadedState } from "./computation-state";
import { InitializeComputationAction, UpdateResultsAction, ComputationAction } from "./computation-actions";

type KnownAction = InitializeComputationAction | UpdateResultsAction;

export function computationReducer(state: ComputationState | undefined, action: KnownAction): ComputationState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case ComputationAction.InitializeComputation:
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
        case ComputationAction.UpdateResults:
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
            return state || unloadedState;
    }
}
