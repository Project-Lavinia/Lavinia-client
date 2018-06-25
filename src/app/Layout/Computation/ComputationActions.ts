import { ElectionType, Election } from "../Interfaces/Models";
import { ComputationPayload } from "../Interfaces/Payloads";
import { LagueDhontResult } from "../Interfaces/Results";
import { ComputationAction } from "../Types";
import { getAlgorithmType, lagueDhont } from "../Logic";

export interface InitializeComputationAction extends ComputationPayload {
    type: ComputationAction.InitializeComputation;
    results: LagueDhontResult;
}

export interface UpdateResultsAction extends ComputationPayload {
    type: ComputationAction.UpdateResults;
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
        type: ComputationAction.InitializeComputation,
        ...payload,
        results
    };
    return initializeAction;
}

export function updateElectionData(payload: ComputationPayload) {
    const results = lagueDhont(payload);

    const updateCalculationAction: UpdateResultsAction = {
        ...payload,
        type: ComputationAction.UpdateResults,
        results
    };
    return updateCalculationAction;
}