import { DistrictResult, SeatPartyResult } from "../computation";

/**
 * Helper method for SingleDistrict to get a map between partyCode and votes
 * required to win the most vulnerable seat.
 * @param districtResult
 *
 * @returns a map where the key is partyCode and the value is votesToWinSeat
 */
export function getVotesToVulnerableSeatMap(districtResult: DistrictResult): Map<string, number> {
    const partyCodeToVulnerableSeatsMap: Map<string, number> = new Map<string, number>();
    const lastSeat = districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
    const winner = lastSeat.partyResults.find((pr) => pr.partyCode === lastSeat.winner)!;
    lastSeat.partyResults.forEach((partyResult) => {
        const currentMarginByVotes = Math.floor(winner.quotient * partyResult.denominator) - partyResult.votes + 1;
        partyCodeToVulnerableSeatsMap.set(partyResult.partyCode, currentMarginByVotes);
    });

    return partyCodeToVulnerableSeatsMap;
}

export function getQuotientsToVulnerableSeatMap(districtResult: DistrictResult): Map<string, number> {
    const partyCodeToQuotientMap = new Map<string, number>();
    const lastSeat = districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
    lastSeat.partyResults.forEach((pr) => partyCodeToQuotientMap.set(pr.partyCode, pr.quotient));
    return partyCodeToQuotientMap;
}

/**
 * Takes all district results and returns the most vulnerable district based on
 * quotient with its winner and runner up, and votes needed to win.
 *
 * @param districtResult result to find vulnerable seat by quotient for
 *
 * @returns vulnerable seat by quotient
 */
export function getMostVulnerableSeatByQuotient(districtResults: DistrictResult[]) {
    const vulnerableDistrictSeats: VulnerableDistrictSeat[] = [];
    districtResults.forEach((districtResult) => {
        vulnerableDistrictSeats.push({
            ...getVulnerableSeatByQuotient(districtResult),
            district: districtResult.name,
        });
    });
    return vulnerableDistrictSeats.sort((a, b) => (a.moreVotesToWin >= b.moreVotesToWin ? 1 : -1))[0];
}

/**
 * Takes a district result and compares the winner to its quotient runner up.
 *
 * @param districtResult result to find vulnerable seat by quotient for
 *
 * @returns vulnerable seat by quotient
 */
export function getVulnerableSeatByQuotient(districtResult: DistrictResult): VulnerableDistrictSeat {
    const lastSeat = districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
    const winner = lastSeat.partyResults.find((pr) => pr.partyCode === lastSeat.winner)!;
    const lastSeatByQuotient = lastSeat.partyResults.sort((a, b) => (a.quotient <= b.quotient ? 1 : -1));
    const runnerUp = lastSeatByQuotient[1];
    const moreVotesToWin = Math.floor(winner.quotient * runnerUp.denominator) - runnerUp.votes + 1;
    return {
        winner,
        runnerUp,
        moreVotesToWin,
        district: districtResult.name,
    };
}

export function getVulnerableSeatByVotes(districtResult: DistrictResult): VulnerableVotes {
    const lastSeat = districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
    const winner = lastSeat.partyResults.find((pr) => pr.partyCode === lastSeat.winner)!;
    const margins: { partyCode: string; moreVotesToWin: number }[] = [];
    lastSeat.partyResults.forEach((partyResult) => {
        const moreVotesToWin = Math.floor(winner.quotient * partyResult.denominator - partyResult.votes + 1);
        margins.push({
            partyCode: partyResult.partyCode,
            moreVotesToWin,
        });
    });
    const sorted = margins.slice().sort((a, b) => (a.moreVotesToWin >= b.moreVotesToWin ? 1 : -1))!;
    return {
        winner,
        partyCode: sorted[1].partyCode,
        moreVotesToWin: sorted[1].moreVotesToWin,
    };
}

interface VulnerableSeat {
    winner: SeatPartyResult;
    runnerUp: SeatPartyResult;
    moreVotesToWin: number;
}

export interface VulnerableDistrictSeat extends VulnerableSeat {
    district: string;
}

export interface VulnerableVotes {
    winner: SeatPartyResult;
    partyCode: string;
    moreVotesToWin: number;
}
