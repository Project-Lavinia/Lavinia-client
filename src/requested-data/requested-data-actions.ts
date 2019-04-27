import { ElectionType, Votes, Metrics, Parameters } from "./requested-data-models";

/**
 * Enum containing all possible RequestedDataAction types.
 */
export enum RequestedDataActionType {
    INITIALIZE_REQUESTED_DATA = "INITIALIZE_REQUESTED_DATA",
    INTIIALIZE_REQUESTED_VOTES = "INITIALIZE_REQUESTED_VOTES",
    INITIALIZE_REQUESTED_METRICS = "INITIALIZE_REQUESTED_METRICS",
    INIITALIZE_REQUESTED_PARAMETERS = "INITIALIZE_REQUESTED_PARAMETERS",
}

/**
 * Type containing all possible RequestedDataActions.
 */
export type RequestedDataAction =
    | InitializeRequestedData
    | InitializeRequestedVotes
    | InitializeRequestedMetrics
    | InitializeRequestedParameters;

/**
 * Action for initializing requested data.
 */
export interface InitializeRequestedData {
    type: RequestedDataActionType.INITIALIZE_REQUESTED_DATA;
    electionType: ElectionType;
    enableAutoSave: boolean;
}

/**
 * Action for initializing requested votes.
 */
export interface InitializeRequestedVotes {
    type: RequestedDataActionType.INTIIALIZE_REQUESTED_VOTES;
    votes: Votes[];
}

/**
 * Action for initializing requested metrics.
 */
export interface InitializeRequestedMetrics {
    type: RequestedDataActionType.INITIALIZE_REQUESTED_METRICS;
    metrics: Metrics[];
}

/**
 * Action for initializing requested parameters.
 */
export interface InitializeRequestedParameters {
    type: RequestedDataActionType.INIITALIZE_REQUESTED_PARAMETERS;
    parameters: Parameters[];
}

/**
 * Action creator for initializing requested data.
 *
 * @param electionType - Election data fetched from the API.
 */
export function initializeRequestedData(electionType: ElectionType) {
    const action: InitializeRequestedData = {
        type: RequestedDataActionType.INITIALIZE_REQUESTED_DATA,
        electionType,
        enableAutoSave: true,
    };
    return action;
}

/**
 * Action creator for initializing requested votes.
 *
 * @param votes - Votes fetched from the API.
 */
export function initializeRequestedVotes(votes: Votes[]) {
    const action: InitializeRequestedVotes = {
        type: RequestedDataActionType.INTIIALIZE_REQUESTED_VOTES,
        votes,
    };
    return action;
}

/**
 * Action creator for initializing requested metrics.
 *
 * @param metrics - Metrics fetched from the API.
 */
export function initializeRequestedMetrics(metrics: Metrics[]) {
    const action: InitializeRequestedMetrics = {
        type: RequestedDataActionType.INITIALIZE_REQUESTED_METRICS,
        metrics,
    };
    return action;
}

/**
 * Action creator for initializing requested parameters.
 *
 * @param parameters - Parameters fetched from the API.
 */
export function InitializeRequestedParameters(parameters: Parameters[]) {
    const action: InitializeRequestedParameters = {
        type: RequestedDataActionType.INIITALIZE_REQUESTED_PARAMETERS,
        parameters,
    };
    return action;
}
