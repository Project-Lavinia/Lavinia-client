import { ComputationPayload, PartyResult, DistrictResult, PartyRestQuotients, Result } from "..";
import { Dictionary, dictionaryToArray } from "../../utilities/dictionary";
import { distributeSeats } from ".";
import { distributeLevelingSeatsOnDistricts, distributeLevelingSeatsOnDistrictsPre2005 } from "./utils";
import { AlgorithmType, DistributionResult } from "../../computation/computation-models";

export function distributeLevelingSeats(
    payload: ComputationPayload,
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
): PartyRestQuotients[] {
    // Filter out parties with less than the threshold
    let levelingPartyCodes = Object.keys(partyResults).filter(
        (partyCode) => partyResults[partyCode].percentVotes >= payload.electionThreshold
    );

    const resultNationalFilter = nationalDistributionFilter(levelingPartyCodes, payload, partyResults);

    levelingPartyCodes = resultNationalFilter.levelingPartyCodes;

    const levelingSeatDistribution = finalLevelingSeatDistribution(
        levelingPartyCodes,
        partyResults,
        payload,
        resultNationalFilter.nationalDistribution
    );

    for (const partyCode in levelingSeatDistribution.seatsWon) {
        if (levelingSeatDistribution.seatsWon.hasOwnProperty(partyCode)) {
            const levelingSeats = levelingSeatDistribution.seatsWon[partyCode];
            partyResults[partyCode].levelingSeats += levelingSeats;
            partyResults[partyCode].totalSeats += levelingSeats;
        }
    }

    levelingPartyCodes = levelingPartyCodes.filter((partyCode) => partyResults[partyCode].levelingSeats > 0);

    let partyRestQuotients: Dictionary<PartyRestQuotients> = {};

    if (payload.election.year < 2005) {
        partyRestQuotients = distributeLevelingSeatsOnDistrictsPre2005(
            payload,
            levelingPartyCodes,
            partyResults,
            districtPartyResults,
            districtResults
        );
    } else {
        partyRestQuotients = distributeLevelingSeatsOnDistricts(
            payload,
            levelingPartyCodes,
            partyResults,
            districtPartyResults,
            districtResults
        );
    }

    const levelingSeatDistributionArray = dictionaryToArray(partyRestQuotients);
    return levelingSeatDistributionArray;
}

function nationalDistributionFilter(
    levelingPartyCodes: string[],
    payload: ComputationPayload,
    partyResults: Dictionary<PartyResult>
): { nationalDistribution: DistributionResult; levelingPartyCodes: string[] } {
    let localLevelingPartyCodes = [...levelingPartyCodes];
    let nationalDistribution: DistributionResult;

    let unfilteredPartiesLength;
    let filteredPartiesLength = localLevelingPartyCodes.length;
    do {
        unfilteredPartiesLength = filteredPartiesLength;

        let totalVotes = 0;
        let seatsToDistribute = payload.levelingSeats;
        const levelingParties: Result[] = [];
        for (const partyCode of localLevelingPartyCodes) {
            totalVotes += partyResults[partyCode].votes;
            seatsToDistribute += partyResults[partyCode].districtSeats;
            const party: Result = {
                countyId: -1,
                electionId: -1,
                partyId: -1,
                resultId: -1,
                countyName: "",
                partyCode,
                partyName: "",
                votes: partyResults[partyCode].votes,
                percentage: -1,
            };
            levelingParties.push(party);
        }

        // Compute the distribution of the total number of seats on the whole country
        nationalDistribution = distributeSeats(
            payload.algorithm,
            payload.firstDivisor,
            Number.MIN_SAFE_INTEGER,
            seatsToDistribute,
            totalVotes,
            levelingParties
        );

        // Filter out parties that did not gain any seats in the new distribution
        localLevelingPartyCodes = localLevelingPartyCodes.filter(
            (p) => nationalDistribution.seatsWon[p] > partyResults[p].districtSeats
        );
        filteredPartiesLength = localLevelingPartyCodes.length;
    } while (filteredPartiesLength !== unfilteredPartiesLength);

    return {
        nationalDistribution,
        levelingPartyCodes: localLevelingPartyCodes,
    };
}

function finalLevelingSeatDistribution(
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    payload: ComputationPayload,
    nationalDistribution: DistributionResult
): DistributionResult {
    if (payload.algorithm === AlgorithmType.SAINTE_LAGUE || payload.algorithm === AlgorithmType.D_HONDT) {
        return finalQuotientLevelingSeatDistribution(levelingPartyCodes, partyResults, payload);
    } else if (
        payload.algorithm === AlgorithmType.LARGEST_FRACTION_DROOP ||
        payload.algorithm === AlgorithmType.LARGEST_FRACTION_HARE ||
        payload.algorithm === AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF
    ) {
        return finalLargestFractionLevelingSeatDistribution(levelingPartyCodes, partyResults, nationalDistribution);
    } else {
        console.error(payload.algorithm + " is not a known quotient or largest fraction algorithm!");
        return {
            seatResults: [],
            seatsWon: {},
        };
    }
}

function finalQuotientLevelingSeatDistribution(
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    payload: ComputationPayload
) {
    let totalVotes = 0;
    const levelingParties = [];
    for (const partyCode of levelingPartyCodes) {
        totalVotes += partyResults[partyCode].votes;
        const party: Result = {
            countyId: -1,
            electionId: -1,
            partyId: -1,
            resultId: -1,
            countyName: "",
            partyCode,
            partyName: "",
            votes: partyResults[partyCode].votes,
            percentage: partyResults[partyCode].percentVotes,
        };
        levelingParties.push(party);
    }

    // Distribute the leveling seats, taking the district seats into account
    return distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        Number.MIN_SAFE_INTEGER,
        payload.levelingSeats,
        totalVotes,
        levelingParties,
        undefined,
        partyResults
    );
}

function finalLargestFractionLevelingSeatDistribution(
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    nationalDistribution: DistributionResult
): DistributionResult {
    const levelingSeatDistribution: Dictionary<number> = {};
    levelingPartyCodes.forEach((partyCode) => {
        levelingSeatDistribution[partyCode] =
            nationalDistribution.seatsWon[partyCode] - partyResults[partyCode].districtSeats;
    });

    return {
        seatResults: [],
        seatsWon: levelingSeatDistribution,
    };
}
