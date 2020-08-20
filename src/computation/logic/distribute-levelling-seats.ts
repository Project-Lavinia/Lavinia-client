import { ComputationPayload, PartyResult, DistrictResult, PartyRestQuotients } from "..";
import { dictionaryToArray } from "../../utilities/dictionary";
import { distributeSeats } from ".";
import { distributeLevelingSeatsOnDistricts, distributeLevelingSeatsOnDistrictsPre2005 } from "./utils";
import { DistributionResult, NationalDistributionResult } from "../../computation/computation-models";
import { isLargestFractionAlgorithm, isQuotientAlgorithm, shouldApply2005Reform } from "./algorithm-utilities";

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
    partyResults: _.Dictionary<PartyResult>,
    districtPartyResults: _.Dictionary<_.Dictionary<PartyResult>>,
    districtResults: _.Dictionary<DistrictResult>
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

    let partyRestQuotients: _.Dictionary<PartyRestQuotients> = {};
    if (shouldApply2005Reform(payload.parameters.electionYear)) {
        partyRestQuotients = distributeLevelingSeatsOnDistricts(
            payload,
            wonLevelingPartyCodes,
            partyResults,
            districtPartyResults,
            districtResults
        );
    } else {
        partyRestQuotients = distributeLevelingSeatsOnDistrictsPre2005(
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
    partyResults: _.Dictionary<PartyResult>
): NationalDistributionResult {
    let totalVotes = 0;
    let seatsToDistribute = payload.levelingSeats;
    const levelingParties: _.Dictionary<PartyResult> = {};
    for (const partyCode of levelingPartyCodes) {
        totalVotes += partyResults[partyCode].votes;
        seatsToDistribute += partyResults[partyCode].districtSeats;
        const party: PartyResult = {
            districtSeats: -1,
            levelingSeats: -1,
            partyCode,
            partyName: "",
            percentVotes: -1,
            proportionality: -1,
            totalSeats: -1,
            votes: partyResults[partyCode].votes,
        };
        levelingParties[partyCode] = party;
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
    partyResults: _.Dictionary<PartyResult>,
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
    partyResults: _.Dictionary<PartyResult>,
    payload: ComputationPayload
) {
    let totalVotes = 0;
    const levelingParties: _.Dictionary<PartyResult> = {};
    for (const partyCode of levelingPartyCodes) {
        totalVotes += partyResults[partyCode].votes;
        const party: PartyResult = {
            districtSeats: -1,
            levelingSeats: -1,
            partyCode,
            partyName: "",
            percentVotes: -1,
            proportionality: -1,
            totalSeats: -1,
            votes: partyResults[partyCode].votes,
        };
        levelingParties[partyCode] = party;
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
    partyResults: _.Dictionary<PartyResult>,
    nationalDistribution: DistributionResult
): DistributionResult {
    const levelingSeatDistribution: _.Dictionary<number> = {};
    levelingPartyCodes.forEach((partyCode) => {
        levelingSeatDistribution[partyCode] =
            nationalDistribution.seatsWon[partyCode] - partyResults[partyCode].districtSeats;
    });

    return {
        seatResults: [],
        seatsWon: levelingSeatDistribution,
    };
}
