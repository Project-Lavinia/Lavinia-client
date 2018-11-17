export interface County {
    countyId: number;
    name: string;
    seats: number;
    countryId: number;
    electionId: number;
    results: Result[];
}

export interface Election {
    electionId: number;
    year: number;
    algorithm: number;
    firstDivisor: number;
    threshold: number;
    seats: number;
    levelingSeats: number;
    countryId: number;
    electionTypeId: number;
    counties: County[];
}

export interface ElectionType {
    countryId: number;
    electionTypeId: number;
    elections: Election[];
    internationalName: string;
}

export interface Result {
    resultId: number;
    votes: number;
    percentage: number;
    electionId: number;
    partyId: number;
    countyId: number;
    countyName: string;
    partyCode: string;
    partyName: string;
}
