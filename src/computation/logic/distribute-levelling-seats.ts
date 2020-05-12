import { ComputationPayload, PartyResult, DistrictResult, PartyRestQuotients, Result } from "..";
import { Dictionary, dictionaryToArray } from "../../utilities/dictionary";
import { distributeSeats } from ".";
import { distributeLevelingSeatsOnDistricts, distributeLevelingSeatsOnDistrictsPre2005 } from "./utils";
import { DistributionResult, NationalDistributionResult } from "../../computation/computation-models";
import { isLargestFractionAlgorithm, isQuotientAlgorithm } from "./algorithm-utilities";

/**
 * Distributes the leveling seats on the parties and on each district.
 *
 * @param payload The computation payload
 * @param partyResults The party results for each party
 * @param districtPartyResults The party results for each district
 * @param districtResults The district results
 */
export function distributeLevelingSeats(
    payload: ComputationPayload,
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
): PartyRestQuotients[] {
    const allPartyCodes = [...Object.keys(partyResults)];
    // Filter out parties with less than the threshold
    const thresholdPartyCodes = allPartyCodes.filter(
        (partyCode) => partyResults[partyCode].percentVotes >= payload.electionThreshold
    );

    const resultNationalFilter = nationalDistributionFilter(thresholdPartyCodes, payload, partyResults);

    const levelingPartyCodes = resultNationalFilter.levelingPartyCodes;

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

    const wonLevelingPartyCodes = levelingPartyCodes.filter((partyCode) => partyResults[partyCode].levelingSeats > 0);

    let partyRestQuotients: Dictionary<PartyRestQuotients> = {};

    if (payload.election.year < 2005) {
        partyRestQuotients = distributeLevelingSeatsOnDistrictsPre2005(
            payload,
            wonLevelingPartyCodes,
            partyResults,
            districtPartyResults,
            districtResults
        );
    } else {
        partyRestQuotients = distributeLevelingSeatsOnDistricts(
            payload,
            wonLevelingPartyCodes,
            partyResults,
            districtPartyResults,
            districtResults
        );
    }

    const levelingSeatDistributionArray = dictionaryToArray(partyRestQuotients);
    return levelingSeatDistributionArray;
}

/**
 * Filters out parties that do not receive more seats in the national distribution than the district distribution.
 * It returns the remaining party codes and the final national distribution of seats.
 *
 * @param levelingPartyCodes The party codes to filter
 * @param payload The computation payload
 * @param partyResults The party results for each party
 */
function nationalDistributionFilter(
    levelingPartyCodes: string[],
    payload: ComputationPayload,
    partyResults: Dictionary<PartyResult>
): NationalDistributionResult {
    let totalVotes = 0;
    let seatsToDistribute = payload.levelingSeats;
    const levelingParties: Result[] = [];
    for (const partyCode of levelingPartyCodes) {
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
    const nationalDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        Number.MIN_SAFE_INTEGER,
        seatsToDistribute,
        totalVotes,
        levelingParties
    );

    // Filter out parties that did not gain any seats in the new distribution
    const filteredLevelingPartyCodes = levelingPartyCodes.filter(
        (p) => nationalDistribution.seatsWon[p] > partyResults[p].districtSeats
    );

    const existsUnfilteredParty = filteredLevelingPartyCodes.length !== levelingPartyCodes.length;
    if (existsUnfilteredParty) {
        return nationalDistributionFilter(filteredLevelingPartyCodes, payload, partyResults);
    }

    return {
        nationalDistribution,
        levelingPartyCodes: filteredLevelingPartyCodes,
    };
}

/**
 * Distributes the leveling seats on each party.
 *
 * @param levelingPartyCodes The party codes for the parties that may win a leveling seat
 * @param partyResults The party results for each party
 * @param payload The computation payload
 * @param nationalDistribution The final national distribution of seats
 */
function finalLevelingSeatDistribution(
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    payload: ComputationPayload,
    nationalDistribution: DistributionResult
): DistributionResult {
    if (isQuotientAlgorithm(payload.algorithm)) {
        return finalQuotientLevelingSeatDistribution(levelingPartyCodes, partyResults, payload);
    } else if (isLargestFractionAlgorithm(payload.algorithm)) {
        return finalLargestFractionLevelingSeatDistribution(levelingPartyCodes, partyResults, nationalDistribution);
    } else {
        console.error(payload.algorithm + " is not a known quotient or largest fraction algorithm!");
        return {
            seatResults: [],
            seatsWon: {},
        };
    }
}

/**
 * Distributes leveling seats on each party using one of the quotient algorithms.
 *
 * @param levelingPartyCodes The party codes for the parties that may win a leveling seat
 * @param partyResults The party results for each party
 * @param payload The computation payload
 */
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

/**
 * Distributes the leveling seats on each party using the largest fraction algorithm.
 *
 * @param levelingPartyCodes The party codes for the parties that may win a leveling seat
 * @param partyResults The party results for each party
 * @param nationalDistribution The final national distribution of seats
 */
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
