import { AlgorithmType } from "../../Types";
import { Election } from "../Models";

export interface ComputationPayload {
    election: Election;
    algorithm: AlgorithmType;
    firstDivisor: number;
    electionThreshold: number;
    districtSeats: number;
    levelingSeats: number;
}