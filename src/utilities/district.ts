import { DistrictResult, SeatPartyResult } from "../computation";

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
export function getVulnerableSeatByQuotient(districtResult: DistrictResult): VulnerableSeat {
    const lastSeat = districtResult.districtSeatResult[districtResult.districtSeatResult.length - 1];
    const lastSeatByQuotient = lastSeat!.partyResults.sort((a, b) => (a.quotient <= b.quotient ? 1 : -1));
    const winner = lastSeatByQuotient[0];
    const runnerUp = lastSeatByQuotient[1];
    const moreVotesToWin = Math.floor(winner.quotient * runnerUp.denominator - runnerUp.votes) + 1;
    return {
        winner,
        runnerUp,
        moreVotesToWin,
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
