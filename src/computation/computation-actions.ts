import { ComputationPayload, LagueDhontResult } from "./computation-models";
import { ElectionType, Election } from "../requested-data/requested-data-models";
import { getAlgorithmType, lagueDhont } from "./logic";

export enum ComputationAction {
    INITIALIZE_COMPUTATION = "INITIALIZE_COMPUTATION",
    UPDATE_COMPUTATION = "UPDATE_CALCULATION"
}
export interface InitializeComputationAction extends ComputationPayload {
    type: ComputationAction.INITIALIZE_COMPUTATION;
    results: LagueDhontResult;
}

export interface UpdateResultsAction extends ComputationPayload {
    type: ComputationAction.UPDATE_COMPUTATION;
    results: LagueDhontResult;
}

export function initializeComputation(electionType: ElectionType) {
    const election: Election = electionType.elections[0]; // Most recent election
    const payload: ComputationPayload = {
        election,
        algorithm: getAlgorithmType(election.algorithm),
        firstDivisor: election.firstDivisor,
        electionThreshold: election.threshold,
        districtSeats: election.seats,
        levelingSeats: election.levelingSeats
    };

    const results = lagueDhont(payload);
    const initializeAction: InitializeComputationAction = {
        type: ComputationAction.INITIALIZE_COMPUTATION,
        ...payload,
        results
    };
    return initializeAction;
}

export function updateElectionData(payload: ComputationPayload) {
    const results = lagueDhont(payload);

    const updateCalculationAction: UpdateResultsAction = {
        ...payload,
        type: ComputationAction.UPDATE_COMPUTATION,
        results
    };
    return updateCalculationAction;
}
