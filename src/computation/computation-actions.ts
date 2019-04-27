import { ComputationPayload, LagueDhontResult } from "./computation-models";
import { ElectionType, Election, Votes, Metrics, Parameters } from "../requested-data/requested-data-models";
import { getAlgorithmType, lagueDhont } from "./logic";
import { unloadedParameters } from "./computation-state";

/**
 * Enum containing all possible ComputationAction types.
 */
export enum ComputationActionType {
    INITIALIZE_COMPUTATION = "INITIALIZE_COMPUTATION",
    UPDATE_COMPUTATION = "UPDATE_CALCULATION",
    SAVE_COMPUTATION = "SAVE_COMPUTATION",
    RESET_SAVED_COMPUTATION = "RESET_SAVED_COMPUTATION",
    UPDATE_HISTORICAL = "UPDATE_HISTORICAL",
}

/**
 * Type containing all possible ComputationActions.
 */
export type ComputationAction =
    | InitializeComputation
    | UpdateComputation
    | SaveComputation
    | ResetSavedComputation
    | UpdateHistorical;

/**
 * Action for initializing the computation.
 */
export interface InitializeComputation extends ComputationPayload {
    type: ComputationActionType.INITIALIZE_COMPUTATION;
    results: LagueDhontResult;
}

/**
 * Action creator for initializing the computation.
 *
 * @param electionType - election data fetched from the API.
 */
export function initializeComputation(
    electionType: ElectionType,
    votes: Votes[],
    metrics: Metrics[],
    parameters: Parameters[]
) {
    const election: Election = electionType.elections[0]; // Most recent election
    const filterVotes: Votes[] = votes.filter((vote) => vote.electionYear === 2017);
    const filterMetrics: Metrics[] = metrics.filter((metric) => metric.electionYear === 2017);
    const filterParameters: Parameters =
        parameters.find((parameter) => parameter.electionYear === 2017) || unloadedParameters;

    const payload: ComputationPayload = {
        election,
        algorithm: getAlgorithmType(election.algorithm),
        firstDivisor: election.firstDivisor,
        electionThreshold: election.threshold,
        districtSeats: election.seats,
        levelingSeats: election.levelingSeats,
        votes: filterVotes,
        metrics: filterMetrics,
        parameters: filterParameters,
    };

    const results = lagueDhont(payload);
    const initializeAction: InitializeComputation = {
        type: ComputationActionType.INITIALIZE_COMPUTATION,
        ...payload,
        results,
    };
    return initializeAction;
}

/**
 * Action for updating the computation.
 */
export interface UpdateComputation extends ComputationPayload {
    type: ComputationActionType.UPDATE_COMPUTATION;
    results: LagueDhontResult;
}

/**
 * Action creator for updating the computation.
 *
 * @param payload - object containing parameters for generating results and
 * updating state.
 */
export function updateComputation(payload: ComputationPayload) {
    const results = lagueDhont(payload);

    const updateCalculationAction: UpdateComputation = {
        ...payload,
        type: ComputationActionType.UPDATE_COMPUTATION,
        results,
    };
    return updateCalculationAction;
}

/**
 * Action for saving the computation for comparisons.
 */
export interface SaveComputation {
    type: ComputationActionType.SAVE_COMPUTATION;
}

/**
 * Action creator for saving the computation for comparisons.
 *
 * @param year - year identifies the data the computation was performed on.
 * @param result - the result of the computation.
 */
export function saveComparison() {
    const action: SaveComputation = {
        type: ComputationActionType.SAVE_COMPUTATION,
    };
    return action;
}

/**
 * Action for resetting the saved computation. The default should be the values
 * from the default computation.
 */
export interface ResetSavedComputation {
    type: ComputationActionType.RESET_SAVED_COMPUTATION;
}

/**
 * Action creator for resetting the saved computation. The default should be
 * the values from the default computation.
 */
export function resetSavedComputation() {
    const action: ResetSavedComputation = {
        type: ComputationActionType.RESET_SAVED_COMPUTATION,
    };
    return action;
}

/**
 * Action for updating the historical reference for the computation.
 */
export interface UpdateHistorical {
    type: ComputationActionType.UPDATE_HISTORICAL;
    historical: LagueDhontResult;
}

/**
 * Action creator for updating the historical reference for the computation.
 *
 * @param election - the election to calculate based on its default parameters
 */
export function updateHistorical(election: Election, votes: Votes[], metrics: Metrics[], parameters: Parameters) {
    const payload: ComputationPayload = {
        election,
        algorithm: getAlgorithmType(election.algorithm),
        districtSeats: election.seats,
        levelingSeats: election.levelingSeats,
        electionThreshold: election.threshold,
        firstDivisor: election.firstDivisor,
        votes,
        metrics,
        parameters,
    };
    const action: UpdateHistorical = {
        type: ComputationActionType.UPDATE_HISTORICAL,
        historical: lagueDhont(payload),
    };
    return action;
}
