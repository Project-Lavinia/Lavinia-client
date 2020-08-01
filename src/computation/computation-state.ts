import { AlgorithmType, LagueDhontResult } from "./computation-models";
import { Election, Votes, Metrics, Parameters } from "../requested-data/requested-data-models";

export interface ComputationState {
    election: Election;
    algorithm: AlgorithmType;
    firstDivisor: number;
    electionThreshold: number;
    districtThreshold: number;
    districtSeats: number;
    levelingSeats: number;
    areaFactor: number;
    historical: LagueDhontResult;
    current: LagueDhontResult;
    comparison: LagueDhontResult;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters;
}

export const unloadedParameters: Parameters = {
    algorithm: {
        algorithm: AlgorithmType.UNDEFINED,
        parameters: {},
    },
    areaFactor: -1,
    districtSeats: -1,
    electionType: "UNDEFINED",
    electionYear: -1,
    levelingSeats: -1,
    threshold: -1,
    totalVotes: -1,
};

export const unloadedState: ComputationState = {
    election: {
        countryId: -1,
        electionTypeId: -1,
        electionId: -1,
        counties: [],
        year: -1,
        algorithm: 0,
        firstDivisor: -1,
        threshold: -1,
        seats: -1,
        levelingSeats: -1,
    },
    algorithm: AlgorithmType.UNDEFINED,
    firstDivisor: -1,
    electionThreshold: -1,
    districtThreshold: -1,
    districtSeats: -1,
    levelingSeats: -1,
    areaFactor: -1,
    historical: {
        districtResults: [],
        partyResults: [],
        levelingSeatDistribution: [],
        finalQuotients: [],
    },
    current: {
        districtResults: [],
        partyResults: [],
        levelingSeatDistribution: [],
        finalQuotients: [],
    },
    comparison: {
        districtResults: [],
        partyResults: [],
        levelingSeatDistribution: [],
        finalQuotients: [],
    },
    votes: [],
    metrics: [],
    parameters: unloadedParameters,
};

export const computationDefaults = {
    firstDivisor: 1.4,
};
