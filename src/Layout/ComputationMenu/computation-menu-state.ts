import { ComputationMenuComparison } from "./computation-menu-models";
import { AlgorithmType } from "../../computation";

export interface ComputationMenuState {
    electionYears: string[];
    year: string;
    algorithm: AlgorithmType;
    firstDivisor: string;
    electionThreshold: string;
    districtThreshold: string;
    districtSeats: string;
    levelingSeats: string;
    autoCompute: boolean;
    areaFactor: string;
    comparison: ComputationMenuComparison;
}

export const unloadedState: ComputationMenuState = {
    electionYears: [],
    year: "",
    algorithm: AlgorithmType.UNDEFINED,
    firstDivisor: "",
    electionThreshold: "",
    districtThreshold: "",
    districtSeats: "",
    levelingSeats: "",
    autoCompute: true,
    areaFactor: "",
    comparison: {
        algorithm: AlgorithmType.UNDEFINED,
        areaFactor: "",
        districtSeats: "",
        electionThreshold: "",
        districtThreshold: "",
        firstDivisor: "",
        levelingSeats: "",
    },
};
