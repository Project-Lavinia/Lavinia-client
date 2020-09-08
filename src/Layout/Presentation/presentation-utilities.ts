import { PartyResult, DistrictResult, LevelingSeat, PartyRestQuotients } from "../../computation";
import { roundNumber } from "../../utilities/number";

function filterPartiesWithoutSeats(partyResults: PartyResult[], nationalResults?: PartyResult[]) {
    let filteredResults = [...partyResults];

    if (nationalResults) {
        filteredResults = filteredResults.filter((party) => {
            const nationalParty = nationalResults.find((nationalParty) => nationalParty.partyCode === party.partyCode);
            if (!nationalParty) {
                return false;
            } else {
                return nationalParty.totalSeats > 0
            }
        });
    } else {
        filteredResults = filteredResults.filter((party) => party.totalSeats > 0);
    }

    return filteredResults;
}

export function getPartyTableData(
    partyResults: PartyResult[],
    showPartiesWithoutSeats: boolean,
    numberOfDecimals: number,
    nationalResults?: PartyResult[],
): PartyResult[] {
    let filteredResults = [...partyResults];

    if (!showPartiesWithoutSeats) {
        filteredResults = filterPartiesWithoutSeats(filteredResults);
    }

    const roundedResults: PartyResult[] = [];

    for (const partyResult of filteredResults) {
        roundedResults.push({
            partyCode: partyResult.partyCode,
            partyName: partyResult.partyName,
            votes: partyResult.votes,
            percentVotes: roundNumber(partyResult.percentVotes, numberOfDecimals),
            districtSeats: partyResult.districtSeats,
            levelingSeats: partyResult.levelingSeats,
            totalSeats: partyResult.totalSeats,
            proportionality: roundNumber(partyResult.proportionality, numberOfDecimals),
        });
    }

    return roundedResults;
}

export function getDistrictTableData(districtResults: DistrictResult[], numberOfDecimals: number): DistrictResult[] {
    const roundedResults: DistrictResult[] = [];

    for (const districtResult of districtResults) {
        roundedResults.push({
            name: districtResult.name,
            votes: districtResult.votes,
            percentVotes: roundNumber(districtResult.percentVotes, numberOfDecimals),
            districtSeats: districtResult.districtSeats,
            levelingSeats: districtResult.levelingSeats,
            totalSeats: districtResult.totalSeats,
            votesPerSeat: roundNumber(districtResult.votesPerSeat, numberOfDecimals),
            districtSeatResult: districtResult.districtSeatResult,
            partyResults: districtResult.partyResults,
        });
    }

    return roundedResults;
}

export function getSeatDistributionData(
    districtResults: DistrictResult[],
    showPartiesWithoutSeats: boolean,
    nationalResults?: PartyResult[],
) {
    if (showPartiesWithoutSeats) {
        return districtResults;
    } else {
        const newDistrictResults: DistrictResult[] = [];

        for (const district of districtResults) {
            newDistrictResults.push({
                name: district.name,
                votes: district.votes,
                percentVotes: district.percentVotes,
                districtSeats: district.districtSeats,
                levelingSeats: district.levelingSeats,
                totalSeats: district.totalSeats,
                votesPerSeat: district.votesPerSeat,
                districtSeatResult: district.districtSeatResult,
                partyResults: filterPartiesWithoutSeats(district.partyResults, nationalResults),
            });
        }

        return newDistrictResults;
    }
}

export function getLocalSeatDistribution(districtResults: DistrictResult[], showPartiesWithoutSeats: boolean) {
    if (showPartiesWithoutSeats) {
        return districtResults;
    } else {
        const newDistrictResults: DistrictResult[] = [];

        for (const district of districtResults) {
            newDistrictResults.push({
                name: district.name,
                votes: district.votes,
                percentVotes: district.percentVotes,
                districtSeats: district.districtSeats,
                levelingSeats: district.levelingSeats,
                totalSeats: district.totalSeats,
                votesPerSeat: district.votesPerSeat,
                districtSeatResult: district.districtSeatResult,
                partyResults: district.partyResults.filter((party) => party.totalSeats > 0),
            });
        }

        return newDistrictResults;
    }
}

export function getSeatsPerPartyData(partyResults: PartyResult[], showPartiesWithoutSeats: boolean): PartyResult[] {
    if (showPartiesWithoutSeats) {
        return partyResults;
    } else {
        return partyResults.filter((party) => party.totalSeats > 0);
    }
}

export function roundPartyResults(partyResults: PartyResult[], numberOfDecimals: number): PartyResult[] {
    const roundedResults: PartyResult[] = [];
    partyResults.forEach((result) => {
        roundedResults.push({
            ...result,
            percentVotes: roundNumber(result.percentVotes, numberOfDecimals),
            proportionality: roundNumber(result.proportionality, numberOfDecimals),
        });
    });
    return roundedResults;
}

/**
 * This function should under no circumstances be used anywhere else than in
 * getLevellingSeats(...) in PresentationComponent -- it is required only
 * because of the way the data is stored, and will unquestionably backfire if
 * used on an arbitrary, unprocessed array of these seats.
 *
 * @param seats seats that can have duplicates depending on how the final round
 * is calculated
 * @returns array of seats that have unique district - seat number combinations.
 */
export function removeSeatDuplicates(seats: LevelingSeat[]): LevelingSeat[] {
    const existingSeatsSet: Set<string> = new Set();
    const uniqueSeats: LevelingSeat[] = [];
    seats.forEach((seat) => {
        if (!existingSeatsSet.has(seat.district + seat.seatNumber)) {
            uniqueSeats.push(seat);
            existingSeatsSet.add(seat.district + seat.seatNumber);
        }
    });
    return uniqueSeats;
}

/**
 * Simple helper function that takes the levelling seats out of an array of
 * party rest quotients  and puts them into its own array
 *
 * @param prqs
 * @returns an array of levelling seats
 */
export function flattenPartyRestQuotients(prqs: PartyRestQuotients[]): LevelingSeat[] {
    const levellingSeats: LevelingSeat[] = [];
    prqs.forEach((prq) => {
        prq.levelingSeats.forEach((seat) => {
            levellingSeats.push(seat);
        });
    });
    return levellingSeats;
}

export function flattenAny(arr: any, result: any[] = []) {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i];
        if (Array.isArray(value)) {
            flattenAny(value, result);
        } else {
            result.push(value);
        }
    }
    return result;
}

/**
 * Helper function that sorts seats by number.
 *
 * @param seats levelling seats
 */
export function sortSeatsByNumber(seats: LevelingSeat[]): LevelingSeat[] {
    const sortedSeats: LevelingSeat[] = seats;
    sortedSeats.sort((a, b) => {
        if (a.seatNumber < b.seatNumber) {
            return -1;
        } else if (a.seatNumber > b.seatNumber) {
            return 1;
        } else {
            return 0;
        }
    });
    return sortedSeats;
}

/**
 * Helper function that returns an array of rounds where seats were assigned
 *
 * @param rounds a round that may or may not have been given a seat
 * @returns rounds in the form of actual levelling seats
 */
export function getRoundsAssignedSeats(rounds: LevelingSeat[]) {
    const seats: LevelingSeat[] = [];
    rounds.forEach((round) => {
        if (round.seatNumber > 0) {
            seats.push(round);
        }
    });
    return seats;
}
