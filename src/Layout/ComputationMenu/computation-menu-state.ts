export interface ComputationMenuState {
    electionYears: string[];
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
    areaFactor: string;
}

export const unloadedState: ComputationMenuState = {
    electionYears: [],
    year: "",
    algorithm: -1,
    firstDivisor: "",
    electionThreshold: "",
    districtThreshold: "",
    districtSeats: "",
    levelingSeats: "",
    autoCompute: true,
    areaFactor: "",
};
