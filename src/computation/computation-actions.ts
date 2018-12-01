import { ComputationPayload, LagueDhontResult } from "./computation-models";
import { ElectionType, Election } from "../requested-data/requested-data-models";
import { getAlgorithmType, lagueDhont } from "./logic";

/**
 * Enum containing all possible ComputationAction types.
 */
export enum ComputationActionType {
    INITIALIZE_COMPUTATION = "INITIALIZE_COMPUTATION",
    UPDATE_COMPUTATION = "UPDATE_CALCULATION",
    SAVE_COMPUTATION = "SAVE_COMPUTATION",
    RESET_SAVED_COMPUTATION = "RESET_SAVED_COMPUTATION",
}

/**
 * Type containing all possible ComputationActions.
 */
export type ComputationAction = InitializeComputation | UpdateComputation | SaveComputation | ResetSavedComputation;

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
export function initializeComputation(electionType: ElectionType) {
    const election: Election = electionType.elections[0]; // Most recent election
    const payload: ComputationPayload = {
        election,
        algorithm: getAlgorithmType(election.algorithm),
        firstDivisor: election.firstDivisor,
        electionThreshold: election.threshold,
        districtSeats: election.seats,
        levelingSeats: election.levelingSeats,
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
    result: LagueDhontResult;
    year: string;
}

/**
 * Action creator for saving the computation for comparisons.
 *
 * @param year - year identifies the data the computation was performed on.
 * @param result - the result of the computation.
 */
export function saveComputation(year: string, result: LagueDhontResult) {
    const action: SaveComputation = {
        type: ComputationActionType.SAVE_COMPUTATION,
        result,
        year,
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
