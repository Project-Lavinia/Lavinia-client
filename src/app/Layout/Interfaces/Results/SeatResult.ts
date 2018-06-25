import { SeatPartyResult } from "./SeatPartyResult";

export interface SeatResult {
    /** Which number this seat has in the distribution (first seat = 0) */
    seatIndex: number;
    /** The partyCode of the party that won the seat */
    winner: string;
    /** A list with information regarding the parties compeating for the seat */
    partyResults: SeatPartyResult[];
}