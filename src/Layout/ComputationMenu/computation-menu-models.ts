import { AlgorithmType } from "../../computation";

export interface ComputationMenuPayload {
    electionYears: string[];
    year: string;
    algorithm: AlgorithmType;
    firstDivisor: string;
    electionThreshold: string;
    districtThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    areaFactor: string;
    autoCompute: boolean;
    forceCompute: boolean;
    comparison: ComputationMenuComparison;
}

export interface ComputationMenuComparison {
    algorithm: AlgorithmType;
    firstDivisor: string;
    electionThreshold: string;
    districtThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    areaFactor: string;
}
