import { ComputationPayload, LagueDhontResult } from "..";

import { dictionaryToArray } from "../../utilities/dictionary";

import { distributeSeats, distributeLevelingSeats, calculateProportionality, finalizeDistrictCalculations } from ".";
import { distributeDistrictSeatsOnDistricts } from "./utils";
import {
    calculateFinalQuotients,
    isQuotientAlgorithm,
    constructDistrictResults,
    getVotesPerDistrict,
    constructPartyResults,
    constructDistrictPartyResults,
    shouldApply2005Reform,
} from "./algorithm-utilities";
import { toSum } from "../../utilities/reduce";

export function lagueDhont(payload: ComputationPayload): LagueDhontResult {
    // Calculate the district seats for each district
    const districtSeats = distributeDistrictSeatsOnDistricts(
        payload.areaFactor,
        19,
        payload.districtSeats,
        payload.metrics
    );

    const totalVotes = payload.votes.map((vote) => vote.votes).reduce(toSum, 0);
    const districtVotes = getVotesPerDistrict(payload.votes);
    const partyResults = constructPartyResults(payload.votes, totalVotes, payload.partyMap);
    const districtPartyResults = constructDistrictPartyResults(payload.votes, districtVotes, payload.partyMap);
    const districtResults = constructDistrictResults(districtSeats, districtVotes, totalVotes);

    // st. lague iterates over each county, and in turn, each party of the party, so first we have to create objects for partyCodes
    for (const metric of payload.metrics) {
        const distributionResult = distributeSeats(
            payload.algorithm,
            payload.firstDivisor,
            payload.districtThreshold,
            districtSeats[metric.district],
            districtResults[metric.district].votes,
            districtPartyResults[metric.district]
        );

        districtResults[metric.district].districtSeatResult = distributionResult.seatResults;

        // Update how many district seats the party has won, both nationally and within the district
        for (const partyCode in distributionResult.seatsWon) {
            partyResults[partyCode].districtSeats += distributionResult.seatsWon[partyCode];
            partyResults[partyCode].totalSeats += distributionResult.seatsWon[partyCode];
            districtPartyResults[metric.district][partyCode].districtSeats += distributionResult.seatsWon[partyCode];
            districtPartyResults[metric.district][partyCode].totalSeats += distributionResult.seatsWon[partyCode];
        }
    }

    const levelingSeatDistribution = distributeLevelingSeats(
        payload,
        partyResults,
        districtPartyResults,
        districtResults
    );

    const totalSeats = payload.districtSeats + payload.levelingSeats;
    calculateProportionality(totalSeats, partyResults, districtPartyResults, districtResults);
    finalizeDistrictCalculations(districtResults);

    for (const countyName in districtPartyResults) {
        districtResults[countyName].partyResults = dictionaryToArray(districtPartyResults[countyName]);
    }
    const districtResultArray = dictionaryToArray(districtResults);
    const partyResultArray = dictionaryToArray(partyResults);

    const useAdjustedQuotients =
        shouldApply2005Reform(payload.parameters.electionYear) && isQuotientAlgorithm(payload.algorithm);
    const finalQuotients = calculateFinalQuotients(
        payload.algorithm,
        payload.firstDivisor,
        useAdjustedQuotients,
        districtResults
    );

    const result: LagueDhontResult = {
        partyResults: partyResultArray,
        districtResults: districtResultArray,
        levelingSeatDistribution,
        finalQuotients,
    };
    return result;
}
