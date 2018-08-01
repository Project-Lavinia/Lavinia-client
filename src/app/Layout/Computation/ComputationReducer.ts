import { ComputationState, unloadedState } from "./ComputationState";
import { InitializeComputationAction, UpdateResultsAction } from "./ComputationActions";
import { ComputationAction as ElectionActionEnum } from "../Types/ActionTypes";

type KnownAction = InitializeComputationAction | UpdateResultsAction;

// NB: BaseReducer Typescript (Reducer<State>) definition changes as of redux 4.0.0
// https://github.com/rt2zz/redux-persist/pull/778

export function computationReducer(state: ComputationState | undefined, action: KnownAction): ComputationState {
    if (state === undefined) {
        state = unloadedState;
    }

    switch (action.type) {
        case ElectionActionEnum.InitializeComputation:
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
        case ElectionActionEnum.UpdateResults:
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
