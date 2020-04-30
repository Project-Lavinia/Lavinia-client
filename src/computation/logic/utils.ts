import { Dictionary, copyDictionary } from "../../utilities/dictionary";
import {
    DistrictResultv2,
    PartyResultv2,
    NationalPartyResult,
    ComputationPayload,
    LevelingSeat,
    PartyRestQuotients,
    PartyResult,
    DistrictResult,
} from "..";
import { Metrics } from "../../requested-data/requested-data-models";
import { sainteLagues, distributionByQuotient } from "./distribution";
import { generateLevelingSeatArray } from ".";
import { KeyValuePair } from "./sorted-reverse-dict";
import { AlgorithmType } from "../computation-models";

export function buildDistrictResults(metrics: Metrics[]): Dictionary<DistrictResultv2> {
    const districtResults: Dictionary<DistrictResultv2> = {};

    // Create an object for each district containing information about the district wide results
    metrics.map(
        (metric) =>
            (districtResults[metric.district] = {
                districtSeats: metric.seats,
                levelingSeats: 0,
                name: metric.district,
                percentVotes: 0,
                totalSeats: metric.seats,
                votes: 0,
                votesPerSeat: 0,
            })
    );

    return districtResults;
}

export function sumAllVotes(
    payload: ComputationPayload,
    districtResults: Dictionary<DistrictResultv2>,
    partyResults: Dictionary<Dictionary<PartyResultv2>>,
    nationalPartyResults: Dictionary<NationalPartyResult>
) {
    // Create an object for each party containing information about it's results by district
    payload.votes.forEach((vote) => {
        // Keep track of the total number of votes cast in each district
        districtResults[vote.district].votes += vote.votes;

        if (vote.party! in partyResults) {
            partyResults[vote.party] = {};
            nationalPartyResults[vote.party] = {
                districtSeats: 0,
                levelingSeats: 0,
                partyCode: vote.party,
                partyName: vote.party,
                percentVotes: 0,
                proportionality: 0,
                totalSeats: 0,
                votes: vote.votes,
            };
        } else {
            // Keep track of how many votes each party received on a national level
            nationalPartyResults[vote.party].votes += vote.votes;
        }

        partyResults[vote.party][vote.district] = {
            district: vote.district,
            districtSeats: 0,
            levelingSeats: 0,
            partyCode: vote.party,
            partyName: vote.party,
            percentVotes: 0,
            proportionality: 0,
            totalSeats: 0,
            votes: vote.votes,
        };
    });
}

export function calculatePercentages(
    totalVotes: number,
    districtResults: Dictionary<DistrictResultv2>,
    partyResults: Dictionary<Dictionary<PartyResultv2>>,
    nationalPartyResults: Dictionary<NationalPartyResult>
) {
    // Iterate over all parties
    for (const party in partyResults) {
        if (partyResults.hasOwnProperty(party)) {
            // Calculate the percentage of the national votes the party received
            nationalPartyResults[party].percentVotes = (nationalPartyResults[party].votes / totalVotes) * 100;

            // Iterate over all districts
            for (const district in partyResults[party]) {
                if (partyResults[party].hasOwnProperty(district)) {
                    // Calculate the percentage of the district votes the party received
                    partyResults[party][district].percentVotes =
                        (partyResults[party][district].votes / districtResults[district].votes) * 100;

                    if (districtResults[district].percentVotes === 0) {
                        // Calculate the percentage of the total national votes was cast in each district
                        districtResults[district].percentVotes = (districtResults[district].votes / totalVotes) * 100;
                    }
                }
            }
        }
    }
}

/**
 * Distributes the district seats over the districts as per:
 * https://lovdata.no/lov/2002-06-28-57/§11-3
 *
 * @param areaFactor The area factor the area should be multiplied with when calculating the numerator for the quotient
 * @param numDistrictSeats The number of district seats that should be distributed
 * @param metrics A list of all the districts with their metrics relevant for this distribution
 */
export function distributeDistrictSeatsOnDistricts(
    areaFactor: number,
    levelingSeats: number,
    numDistrictSeats: number,
    metrics: Metrics[]
): Dictionary<number> {
    let districtSeats: Dictionary<number> = {};
    const baseValues: Dictionary<number> = {};

    // Wrap Sainte Lagues so it only takes one argument
    function denominatorFunction(seatsWon: number): number {
        return sainteLagues(seatsWon, 1);
    }

    if (areaFactor === -1) {
        // If we don't have an area factor, just return the predetermined values
        metrics.forEach((metric) => (districtSeats[metric.district] = metric.seats));
    } else {
        metrics.forEach((metric) => {
            // Fill districtSeats with all the districts, with no wins yet
            districtSeats[metric.district] = 0;
            // Calculate the distribution numbers for each district to be used as numerators in the quotients
            baseValues[metric.district] = metric.population + metric.area * areaFactor;
        });

        districtSeats = distributionByQuotient(
            numDistrictSeats + levelingSeats,
            districtSeats,
            baseValues,
            denominatorFunction
        );

        districtSeats = subtractLevelingSeats(districtSeats);
    }
    return districtSeats;
}

/**
 * Subtracts the leveling seats from the seat mapping.
 *
 * @param seatMapping The mapping between district and number of seats to subtract from
 */
function subtractLevelingSeats(seatMapping: Dictionary<number>): Dictionary<number> {
    const copyMapping = copyDictionary(seatMapping);

    for (const name in copyMapping) {
        if (copyMapping.hasOwnProperty(name)) {
            copyMapping[name]--;
        }
    }

    return copyMapping;
}

export function distributeLevelingSeatsOnDistricts(
    payload: ComputationPayload,
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
): Dictionary<PartyRestQuotients> {
    let finishedDistricts: string[] = [];
    let levelingSeats: LevelingSeat[] = [];
    const partyRestQuotients: Dictionary<PartyRestQuotients> = {};

    const partySeats: Dictionary<number> = {};
    let seatIndex = 1;
    let quotientIndex = 1;
    while (seatIndex <= payload.levelingSeats) {
        if (levelingSeats.length === 0) {
            finishedDistricts = [];
            levelingSeats = generateLevelingSeatArray(
                AlgorithmType.SAINTE_LAGUE,
                levelingPartyCodes,
                partyResults,
                districtResults,
                districtPartyResults,
                true
            );
        }
        const seat = levelingSeats[0];
        seat.quotientNumber = quotientIndex++;
        let numberOfSeats = partySeats[seat.partyCode];
        if (numberOfSeats === undefined) {
            numberOfSeats = 0;
            partySeats[seat.partyCode] = 0;
        }

        if (numberOfSeats < partyResults[seat.partyCode].levelingSeats && !finishedDistricts.includes(seat.district)) {
            seat.seatNumber = seatIndex++;

            partySeats[seat.partyCode]++;
            districtResults[seat.district].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].totalSeats++;

            finishedDistricts.push(seat.district);
        }

        if (partyRestQuotients[seat.partyCode] === undefined) {
            partyRestQuotients[seat.partyCode] = {
                partyCode: seat.partyCode,
                levelingSeats: [seat],
            };
        } else {
            partyRestQuotients[seat.partyCode].levelingSeats.push(seat);
        }

        levelingSeats.shift();
    }

    return partyRestQuotients;
}

export function distributeLevelingSeatsOnDistrictsPre2005(
    payload: ComputationPayload,
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
): Dictionary<PartyRestQuotients> {
    let levelingSeats: LevelingSeat[] = [];
    const partyRestQuotients: Dictionary<PartyRestQuotients> = {};

    const partySeats: Dictionary<number> = {};
    let seatIndex = 1;
    let quotientIndex = 1;
    while (seatIndex <= payload.levelingSeats) {
        if (levelingSeats.length === 0) {
            levelingSeats = generateLevelingSeatArray(
                AlgorithmType.SAINTE_LAGUE,
                levelingPartyCodes,
                partyResults,
                districtResults,
                districtPartyResults,
                false
            );
        }
        const seat = levelingSeats[0];
        seat.quotientNumber = quotientIndex++;
        let numberOfSeats = partySeats[seat.partyCode];
        if (numberOfSeats === undefined) {
            numberOfSeats = 0;
            partySeats[seat.partyCode] = 0;
        }

        if (numberOfSeats < partyResults[seat.partyCode].levelingSeats) {
            seat.seatNumber = seatIndex++;

            partySeats[seat.partyCode]++;
            districtResults[seat.district].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].levelingSeats++;
            districtPartyResults[seat.district][seat.partyCode].totalSeats++;
        }

        if (partyRestQuotients[seat.partyCode] === undefined) {
            partyRestQuotients[seat.partyCode] = {
                partyCode: seat.partyCode,
                levelingSeats: [seat],
            };
        } else {
            partyRestQuotients[seat.partyCode].levelingSeats.push(seat);
        }

        levelingSeats.shift();
    }
    return partyRestQuotients;
}

/**
 * Breaks ties in the distribution of items on names
 *
 * @param winners The list of multiple winners from the distribution stage
 * @param baseValue The dictionary from winners to their respective numerators
 */
export function tieBreaker(winners: KeyValuePair[], baseValue: Dictionary<number>): KeyValuePair {
    const winnersCopy = [...winners];

    // Find the highest numerator of the winners
    const numerators = winners.map((entry) => baseValue[entry.key]);
    const maxNumerator = Math.max(...numerators);

    // Filter out all winners that did not have the highest numerator
    winnersCopy.filter((item) => baseValue[item.key] === maxNumerator);

    // We will always do the coin flip, because if there is only 1 item there is 100% chance of it being selected.
    // And the coinflip should be performed if there are more than 1 item remaining at this stage
    return winnersCopy[Math.floor(Math.random() * winnersCopy.length)];
}
