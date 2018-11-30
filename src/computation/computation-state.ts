﻿import { AlgorithmType, LagueDhontResult } from "./computation-models";
import { Election } from "../requested-data/requested-data-models";

export interface ComputationState {
    election: Election;
    algorithm: AlgorithmType;
    firstDivisor: number;
    electionThreshold: number;
    districtSeats: number;
    levelingSeats: number;
    current: LagueDhontResult;
    saved: LagueDhontResult;
}

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
    algorithm: AlgorithmType.Undefined,
    firstDivisor: -1,
    electionThreshold: -1,
    districtSeats: -1,
    levelingSeats: -1,
    current: {
        districtResults: [],
        partyResults: [],
        levelingSeatDistribution: [],
    },
    saved: {
        districtResults: [],
        partyResults: [],
        levelingSeatDistribution: [],
    },
};
