import { Dictionary } from "../Utilities";
import { SeatResult } from "./SeatResult";

export interface DistributionResult {
    /** A dictionary taking partyCodes and returning the matching number of seats won in this distribution */
    seatsWon: Dictionary<number>;
    /** List of information regarding the distribution of the individual seats */
    seatResults: SeatResult[];
}
