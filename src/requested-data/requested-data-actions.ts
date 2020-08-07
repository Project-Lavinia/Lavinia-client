import { Votes, Metrics, Parameters } from "./requested-data-models";

/**
 * Enum containing all possible RequestedDataAction types.
 */
export enum RequestedDataActionType {
    INTIIALIZE_REQUESTED_VOTES = "INITIALIZE_REQUESTED_VOTES",
    INITIALIZE_REQUESTED_METRICS = "INITIALIZE_REQUESTED_METRICS",
    INIITALIZE_REQUESTED_PARAMETERS = "INITIALIZE_REQUESTED_PARAMETERS",
    INIITALIZE_REQUESTED_PARTY_MAP = "INTITIALIZE_REQUESTED_PARTY_MAP",
}

/**
 * Type containing all possible RequestedDataActions.
 */
export type RequestedDataAction =
    | InitializeRequestedVotes
    | InitializeRequestedMetrics
    | InitializeRequestedParameters
    | InitializeRequestedPartyMap;

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
 * Action for initializing requested party map.
 */
export interface InitializeRequestedPartyMap {
    type: RequestedDataActionType.INIITALIZE_REQUESTED_PARTY_MAP;
    partyMap: _.Dictionary<string>;
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
export function initializeRequestedParameters(parameters: Parameters[]) {
    const action: InitializeRequestedParameters = {
        type: RequestedDataActionType.INIITALIZE_REQUESTED_PARAMETERS,
        parameters,
    };
    return action;
}

/**
 * Action creator for initializing requested PartyMap.
 *
 * @param partyMap - PartyMap fetched from the API.
 */
export function initializeRequestedPartyMap(partyMap: _.Dictionary<string>) {
    const action: InitializeRequestedPartyMap = {
        type: RequestedDataActionType.INIITALIZE_REQUESTED_PARTY_MAP,
        partyMap,
    };
    return action;
}
