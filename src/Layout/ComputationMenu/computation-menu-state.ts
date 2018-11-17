export interface ComputationMenuState {
    electionYears: string[];
    year: string;
    algorithm: number;
    firstDivisor: string;
    electionThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
}

export const unloadedState: ComputationMenuState = {
    electionYears: [],
    year: "",
    algorithm: -1,
    firstDivisor: "",
    electionThreshold: "",
    districtSeats: "",
    levelingSeats: "",
    autoCompute: true
};
