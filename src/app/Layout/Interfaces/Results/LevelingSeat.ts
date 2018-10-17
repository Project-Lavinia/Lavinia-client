export interface LevelingSeat {
    /** The number of when this seat was selected, 0 if it was never selected. */
    seatNumber: number;
    /** The number this quotient had in the total quoteint list. */
    quotientNumber: number;
    /** The district the seat belongs to */
    district: string;
    /** The party the seat belongs to */
    partyCode: string;
    /** The rest-quotient computed for this seat */
    quotient: number;
}
