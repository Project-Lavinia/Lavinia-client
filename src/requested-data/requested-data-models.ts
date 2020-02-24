import { Dictionary, RawDictionaryEntry } from "../utilities/dictionary";

export interface County {
    countyId: number;
    name: string;
    seats: number;
    countryId: number;
    electionId: number;
    results: Result[];
}

export interface Election {
    electionId: number;
    year: number;
    algorithm: number;
    firstDivisor: number;
    threshold: number;
    seats: number;
    levelingSeats: number;
    countryId: number;
    electionTypeId: number;
    counties: County[];
}

export interface ElectionType {
    countryId: number;
    electionTypeId: number;
    elections: Election[];
    internationalName: string;
}

export interface Result {
    resultId: number;
    votes: number;
    percentage: number;
    electionId: number;
    partyId: number;
    countyId: number;
    countyName: string;
    partyCode: string;
    partyName: string;
}

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
    id: number;
    algorithm: string;
    parameters: Dictionary<number>;
}

export interface RawParameters {
    electionYear: number;
    electionType: string;
    algorithm: RawAlgorithm;
    threshold: number;
    areaFactor: number;
    districtSeats: Array<RawDictionaryEntry>;
    levelingSeats: number;
    totalVotes: number;
}

export interface Parameters {
    electionYear: number;
    electionType: string;
    algorithm: Algorithm;
    threshold: number;
    areaFactor: number;
    districtSeats: Dictionary<number>;
    levelingSeats: number;
    totalVotes: number;
}
