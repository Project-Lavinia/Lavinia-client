import { ComputationPayload, LagueDhontResult } from "./computation-models";
import { Votes, Metrics, Parameters, FirstDivisor } from "../requested-data/requested-data-models";
import { lagueDhont } from "./logic";
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
    year: number,
    votes: Votes[],
    metrics: Metrics[],
    parameters: Parameters[],
    partyMap: _.Dictionary<string>
) {
    const filterVotes: Votes[] = votes.filter((vote) => vote.electionYear === year);
    const filterMetrics: Metrics[] = metrics.filter((metric) => metric.electionYear === year);
    const filterParameters: Parameters =
        parameters.find((parameter) => parameter.electionYear === year) || unloadedParameters;

    const payload: ComputationPayload = {
        algorithm: filterParameters.algorithm.algorithm,
        firstDivisor: filterParameters.algorithm.parameters[FirstDivisor],
        electionThreshold: filterParameters.threshold,
        districtThreshold: 0,
        districtSeats: filterParameters.districtSeats,
        levelingSeats: filterParameters.levelingSeats,
        areaFactor: filterParameters.areaFactor,
        votes: filterVotes,
        metrics: filterMetrics,
        parameters: filterParameters,
        partyMap,
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
export function updateHistorical(
    votes: Votes[],
    metrics: Metrics[],
    parameters: Parameters,
    partyMap: _.Dictionary<string>
) {
    const payload: ComputationPayload = {
        algorithm: parameters.algorithm.algorithm,
        districtSeats: parameters.districtSeats,
        levelingSeats: parameters.levelingSeats,
        electionThreshold: parameters.threshold,
        districtThreshold: 0,
        firstDivisor: parameters.algorithm.parameters[FirstDivisor],
        areaFactor: parameters.areaFactor,
        votes,
        metrics,
        parameters,
        partyMap,
    };
    const action: UpdateHistorical = {
        type: ComputationActionType.UPDATE_HISTORICAL,
        historical: lagueDhont(payload),
    };
    return action;
}
