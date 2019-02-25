import { DistrictResult, SeatPartyResult } from "../computation";

export function getMostVulnerableSeat(districtResults: DistrictResult[]) {
    const vulnerableDistrictSeats: VulnerableDistrictSeat[] = [];
    districtResults.forEach((districtResult) => {
        vulnerableDistrictSeats.push({
            ...getVulnerableSeat(districtResult),
            district: districtResult.name,
        });
    });
    return vulnerableDistrictSeats.sort((a, b) => (a.moreVotesToWin >= b.moreVotesToWin ? 1 : -1))[0];
}

export function getVulnerableSeat(districtResult: DistrictResult): VulnerableSeat {
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
