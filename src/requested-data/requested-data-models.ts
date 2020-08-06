import { Dictionary, RawDictionaryEntry } from "../utilities/dictionary";
import { AlgorithmType } from "../computation";

export interface Votes {
    party: string;
    votes: number;
    district: string;
    electionYear: number;
    electionType: string;
}

export interface Metrics {
    district: string;
    electionYear: number;
    area: number;
    population: number;
    seats: number;
}

export interface RawAlgorithm {
    id: number;
    algorithm: string;
    parameters: Array<RawDictionaryEntry>;
}

export interface Algorithm {
    algorithm: AlgorithmType;
    parameters: Dictionary<number>;
}

export interface RawParameters {
    electionYear: number;
    electionType: string;
    algorithm: RawAlgorithm;
    threshold: number;
    areaFactor: number;
    districtSeats: number;
    levelingSeats: number;
    totalVotes: number;
}

export interface Parameters {
    electionYear: number;
    electionType: string;
    algorithm: Algorithm;
    threshold: number;
    areaFactor: number;
    districtSeats: number;
    levelingSeats: number;
    totalVotes: number;
}

export const FirstDivisor = "First Divisor";
