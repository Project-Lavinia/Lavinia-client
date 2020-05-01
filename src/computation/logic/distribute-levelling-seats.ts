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
    let levelingParties: Result[] = Object.keys(partyResults).map((partyCode) => {
        return {
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
    });

    // Compute the distribution of the total number of seats on the whole country
    const nationalDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        Number.MIN_SAFE_INTEGER,
        payload.districtSeats + payload.levelingSeats,
        levelingParties
    );

    // Filter out parties with less votes than the threshold or who did not gain any seats from the national distribution
    levelingParties = levelingParties.filter(
        (party) =>
            nationalDistribution.seatsWon[party.partyCode] >= partyResults[party.partyCode].districtSeats &&
            partyResults[party.partyCode].percentVotes >= payload.electionThreshold
    );

    let levelingPartyCodes = levelingParties.map((party) => party.partyCode);

    // Distribute the leveling seats, taking the district seats into account
    const levelingSeatsDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        Number.MIN_SAFE_INTEGER,
        payload.levelingSeats,
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
