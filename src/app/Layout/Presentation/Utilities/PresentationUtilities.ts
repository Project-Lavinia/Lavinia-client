import { PartyResult, DistrictResult } from "../../Interfaces/Results";
import { roundNumber } from "./NumberUtilities";
import { Dictionary } from "../../Interfaces/Utilities";

export function getPartyTableData(
    partyResults: PartyResult[],
    showPartiesWithoutSeats: boolean,
    numberOfDecimals: number
): PartyResult[] {
    let filteredResults = [...partyResults];

    if (!showPartiesWithoutSeats) {
        filteredResults = filteredResults.filter(party => party.totalSeats > 0);
    }

    const roundedResults: PartyResult[] = [];

    for (const partyResult of filteredResults) {
        roundedResults.push({
            partyCode: partyResult.partyCode,
            partyName: partyResult.partyName,
            votes: partyResult.votes,
            percentVotes: roundNumber(
                partyResult.percentVotes,
                numberOfDecimals
            ),
            districtSeats: partyResult.districtSeats,
            levelingSeats: partyResult.levelingSeats,
            totalSeats: partyResult.totalSeats,
            proportionality: roundNumber(
                partyResult.proportionality,
                numberOfDecimals
            )
        });
    }

    return roundedResults;
}

export function getDistrictTableData(
    districtResults: DistrictResult[],
    numberOfDecimals: number
): DistrictResult[] {
    const roundedResults: DistrictResult[] = [];

    for (const districtResult of districtResults) {
        roundedResults.push({
            name: districtResult.name,
            votes: districtResult.votes,
            percentVotes: roundNumber(
                districtResult.percentVotes,
                numberOfDecimals
            ),
            districtSeats: districtResult.districtSeats,
            levelingSeats: districtResult.levelingSeats,
            totalSeats: districtResult.totalSeats,
            votesPerSeat: roundNumber(
                districtResult.votesPerSeat,
                numberOfDecimals
            ),
            districtSeatResult: districtResult.districtSeatResult,
            partyResults: districtResult.partyResults
        });
    }

    return roundedResults;
}

export function getSeatDistributionData(
    districtResults: DistrictResult[],
    partyResults: PartyResult[],
    showPartiesWithoutSeats: boolean
) {
    if (showPartiesWithoutSeats) {
        return districtResults;
    } else {
        const partySeats: Dictionary<number> = {};
        const newDistrictResults: DistrictResult[] = [];

        for (const party of partyResults) {
            partySeats[party.partyCode] = party.totalSeats;
        }

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
                partyResults: district.partyResults.filter(
                    party => partySeats[party.partyCode] > 0
                )
            });
        }

        return newDistrictResults;
    }
}

export function getSeatsPerPartyData(
    partyResults: PartyResult[],
    showPartiesWithoutSeats: boolean
): PartyResult[] {
    if (showPartiesWithoutSeats) {
        return partyResults;
    } else {
        return partyResults.filter(party => party.totalSeats > 0);
    }
}
