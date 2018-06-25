import { SeatResult } from "./SeatResult";
import { PartyResult } from "./PartyResult";

export interface DistrictResult {
    /** Name of the district */
    name: string;
    /** Number of district seats available */
    districtSeats: number;
    /** Number of leveling seats received */
    levelingSeats: number;
    totalSeats: number;
    /** Total number of votes cast in the district */
    votes: number;
    /** How many percent of all votes were cast in this district */
    percentVotes: number;
    /** Average number of votes per seat */
    votesPerSeat: number;
    /** Overview of details regarding quotients per party and winner for each district seat */
    districtSeatResult: SeatResult[];
    /** Overview of how many votes, percent of votes and seats each party got */
    partyResults: PartyResult[];
}