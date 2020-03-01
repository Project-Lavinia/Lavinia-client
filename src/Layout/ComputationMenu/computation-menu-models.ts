export interface ComputationMenuPayload {
    electionYears: string[];
    year: string;
    algorithm: number;
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
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    areaFactor: string;
}
