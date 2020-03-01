import { ComputationPayload, PartyResult, DistrictResult, PartyRestQuotients, Result } from "..";
import { Dictionary, dictionaryToArray } from "../../utilities/dictionary";
import { distributeSeats } from ".";
import { distributeLevelingSeatsOnDistricts, distributeLevelingSeatsOnDistrictsPre2005 } from "./utils";

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

    let levelingParties: Result[] = [];
    for (const partyCode of levelingPartyCodes) {
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
        payload.districtSeats + payload.levelingSeats,
        payload.parameters.totalVotes,
        levelingParties
    );

    // Filter out parties that did not gain any seats in the new distribution
    levelingPartyCodes = levelingPartyCodes.filter(
        (p) => nationalDistribution.seatsWon[p] > partyResults[p].districtSeats
    );

    levelingParties = [];
    for (const partyCode of levelingPartyCodes) {
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

    // Distribute the leveling seats, taking the district seats into account
    const levelingSeatsDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        payload.levelingSeats,
        payload.parameters.totalVotes,
        levelingParties,
        undefined,
        partyResults
    );

    for (const partyCode in levelingSeatsDistribution.seatsWon) {
        if (levelingSeatsDistribution.seatsWon.hasOwnProperty(partyCode)) {
            const levelingSeats = levelingSeatsDistribution.seatsWon[partyCode];
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

    const levelingSeatDistribution = dictionaryToArray(partyRestQuotients);
    return levelingSeatDistribution;
}
