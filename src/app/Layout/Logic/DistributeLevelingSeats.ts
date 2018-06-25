import { ComputationPayload } from "../Interfaces/Payloads";
import { Result, PartyResult, LevelingSeat, DistrictResult, PartyRestQuotients } from "../Interfaces/Results";
import { Dictionary } from "../Interfaces/Utilities";
import {
    distributeSeats,
    generateLevelingSeatArray
} from "./AlgorithmUtils";
import { dictionaryToArray } from "./DictionaryUtilities";

export function distributeLevelingSeats(
    payload: ComputationPayload,
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
): PartyRestQuotients[] {
    // Filter out parties with less than the threshold
    let levelingPartyCodes = Object.keys(partyResults).filter(
        partyCode =>
            partyResults[partyCode].percentVotes >= payload.electionThreshold
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
            percentage: -1
        };
        levelingParties.push(party);
    }

    // Compute the distribution of the total number of seats on the whole country
    const nationalDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        payload.districtSeats + payload.levelingSeats,
        levelingParties
    );

    // Filter out parties that did not gain any seats in the new distribution
    levelingPartyCodes = levelingPartyCodes.filter(
        p => nationalDistribution.seatsWon[p] > partyResults[p].districtSeats
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
            percentage: -1
        };
        levelingParties.push(party);
    }

    // Distribute the leveling seats, taking the district seats into account
    const levelingSeatsDistribution = distributeSeats(
        payload.algorithm,
        payload.firstDivisor,
        payload.levelingSeats,
        levelingParties,
        partyResults
    );

    for (const partyCode in levelingSeatsDistribution.seatsWon) {
        if (levelingSeatsDistribution.seatsWon.hasOwnProperty(partyCode)) {
            const levelingSeats = levelingSeatsDistribution.seatsWon[partyCode];
            partyResults[partyCode].levelingSeats += levelingSeats;
            partyResults[partyCode].totalSeats += levelingSeats;
        }
    }

    levelingPartyCodes = levelingPartyCodes.filter(
        partyCode => partyResults[partyCode].levelingSeats > 0
    );

    let levelingSeats: LevelingSeat[] = [];
    let finalLevelingSeats: LevelingSeat[] = [];
    const partyRestQuotients: Dictionary<PartyRestQuotients> = {};

    const partySeats: Dictionary<number> = {};
    let seatIndex = 1;
    while (seatIndex <= payload.levelingSeats) {
        if (levelingSeats.length === 0) {
            levelingSeats = generateLevelingSeatArray(
                payload.algorithm,
                levelingPartyCodes,
                partyResults,
                districtResults,
                districtPartyResults
            );
            finalLevelingSeats = [...levelingSeats];
        }
        const seat = levelingSeats[0];
        let numberOfSeats = partySeats[seat.partyCode];
        if (numberOfSeats === undefined) {
            numberOfSeats = 0;
            partySeats[seat.partyCode] = 0;
        }

        if (numberOfSeats >= partyResults[seat.partyCode].levelingSeats) {
            levelingSeats = levelingSeats.filter(
                filterSeat =>
                    filterSeat.partyCode !== seat.partyCode
            );
        } else {
            seat.seatNumber = seatIndex++;

            partySeats[seat.partyCode]++;
            districtResults[seat.district].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].totalSeats++;

            if (partyRestQuotients[seat.partyCode] === undefined) {
                partyRestQuotients[seat.partyCode] = {
                    partyCode: seat.partyCode,
                    levelingSeats: [seat]
                };
            } else {
                partyRestQuotients[seat.partyCode].levelingSeats.push(seat);
            }

            levelingSeats = levelingSeats.filter(
                filterSeat => filterSeat.district !== seat.district
            );
        }
    }

    for (const seat of finalLevelingSeats) {
        if (partyRestQuotients[seat.partyCode] === undefined) {
            partyRestQuotients[seat.partyCode] = {
                partyCode: seat.partyCode,
                levelingSeats: [seat]
            };
        } else {
            partyRestQuotients[seat.partyCode].levelingSeats.push(seat);
        }
    }

    const levelingSeatDistribution = dictionaryToArray(partyRestQuotients);
    return levelingSeatDistribution;
}
