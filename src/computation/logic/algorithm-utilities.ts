import {
    AlgorithmType,
    Result,
    SeatResult,
    PartyResult,
    DistributionResult,
    DistrictResult,
    LevelingSeat,
    DistrictQuotients,
} from "..";
import { Dictionary } from "../../utilities/dictionary";
import { SeatPartyResult } from "./../../computation/computation-models";
import * as _ from "lodash";

const illegalPartyCodes = new Set(["BLANKE"]);

/**
 * Distributes a number of partyResults on a set of parties, based on their number of votes,
 * how many partyResults they already received (if applicable) and a specific algorithm.
 *
 * @param algorithm The type of algorithm in use
 * @param firstDivisor The first divisor to use
 * @param numSeats Number of partyResults to distribute
 * @param results A list of how many votes each party received
 * @param partyResults [optional] If a number of partyResults have been distributed, this parameter can be specified to continue from the existing distribution
 */
export function distributeSeats(
    algorithm: AlgorithmType,
    firstDivisor: number,
    districtThreshold: number,
    numSeats: number,
    results: Result[],
    averageVotesPerSeat?: number,
    partyResults?: Dictionary<PartyResult>
): DistributionResult {
    const seatsWon: Dictionary<number> = {};
    const currentSeatsWon: Dictionary<number> = {};
    const seatResults: SeatResult[] = [];

    if (partyResults === undefined) {
        for (const party of results) {
            seatsWon[party.partyCode] = 0;
            currentSeatsWon[party.partyCode] = 0;
        }
    } else {
        for (const partyCode in partyResults) {
            if (partyResults.hasOwnProperty(partyCode)) {
                const result = partyResults[partyCode];
                seatsWon[partyCode] = result.districtSeats;
                currentSeatsWon[partyCode] = 0;
            }
        }
    }

    for (let i = 0; i < numSeats; i++) {
        const seatResult: SeatResult = {
            seatIndex: i,
            winner: "",
            partyResults: [],
        };

        let currentWinners = [
            {
                partyCode: "",
                quotient: -1,
                denominator: -1,
                votes: -1,
            },
        ];

        for (const result of results) {
            const currentDenominator = getDenominator(algorithm, seatsWon[result.partyCode], firstDivisor);
            const currentQuotient =
                averageVotesPerSeat != null
                    ? calculateAdjustedQuotient(
                          algorithm,
                          seatsWon[result.partyCode],
                          averageVotesPerSeat,
                          result.votes,
                          firstDivisor
                      )
                    : calculateQuotient(algorithm, seatsWon[result.partyCode], result.votes, firstDivisor);
            const currentPartyResult = {
                partyCode: result.partyCode,
                quotient: currentQuotient,
                denominator: currentDenominator,
                votes: result.votes,
            };
            seatResult.partyResults.push(currentPartyResult);

            if (!illegalPartyCodes.has(result.partyCode) && result.percentage > districtThreshold) {
                currentWinners = updateWinners(currentWinners, currentPartyResult);
            }
        }

        const winner = _.sample(currentWinners);
        seatsWon[winner!.partyCode] += 1;
        currentSeatsWon[winner!.partyCode] += 1;

        seatResult.winner = winner!.partyCode;
        seatResults.push(seatResult);
    }

    return {
        seatsWon: currentSeatsWon,
        seatResults,
    };
}

function updateWinners(winners: SeatPartyResult[], currentParty: SeatPartyResult): SeatPartyResult[] {
    if (currentParty.quotient > winners[0].quotient) {
        return [currentParty];
    } else if (currentParty.quotient === winners[0].quotient) {
        if (currentParty.votes > winners[0].votes) {
            return [currentParty];
        } else if (currentParty.votes === winners[0].votes) {
            winners.push(currentParty);
        }
    }
    return winners;
}

/**
 * Returns a denominator based on an algorithm, the number of partyResults the party has
 * and a first divisor
 *
 * @param algorithm The algorithm to get the denominator for
 * @param numberOfSeatsAssigned The number of partyResults assigned to the party in question
 * @param firstDivisor The first divisor to use if the party has 0 partyResults
 */
export function getDenominator(algorithm: AlgorithmType, numberOfSeatsAssigned: number, firstDivisor: number) {
    switch (algorithm) {
        case AlgorithmType.SAINTE_LAGUE:
            if (numberOfSeatsAssigned === 0) {
                return firstDivisor;
            } else {
                return 2 * numberOfSeatsAssigned + 1;
            }
        case AlgorithmType.D_HONDT:
            return numberOfSeatsAssigned + 1;
        default:
            console.error(`ERROR! ${algorithm.toString()} does not have an associated denominator function!`);
            return Number.MIN_SAFE_INTEGER;
    }
}

/**
 * Calculates the proportionality beteen the number of votes and the number of seats received.
 * Can be summed up and divided by 2 to reveal the true Loosemore-Hanbys index of the results.
 *
 * @param totalSeats The total number of seats to be distributed nationally
 * @param partyResults The current national party results
 * @param districtPartyResults The current district-level party results
 * @param districtResults The current district results
 */
export function calculateProportionality(
    totalSeats: number,
    partyResults: Dictionary<PartyResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    districtResults: Dictionary<DistrictResult>
) {
    for (const partyCode in partyResults) {
        if (partyResults.hasOwnProperty(partyCode) && !illegalPartyCodes.has(partyCode)) {
            const percentSeats = (partyResults[partyCode].totalSeats / totalSeats) * 100;
            partyResults[partyCode].proportionality = percentSeats - partyResults[partyCode].percentVotes;
        }
    }

    for (const county in districtPartyResults) {
        if (districtPartyResults.hasOwnProperty(county)) {
            const totalDistrictSeats = districtResults[county].districtSeats + districtResults[county].levelingSeats;
            for (const partyCode in districtPartyResults[county]) {
                if (districtPartyResults[county].hasOwnProperty(partyCode) && !illegalPartyCodes.has(partyCode)) {
                    const percentSeats =
                        (districtPartyResults[county][partyCode].totalSeats / totalDistrictSeats) * 100;
                    districtPartyResults[county][partyCode].proportionality =
                        percentSeats - districtPartyResults[county][partyCode].percentVotes;
                }
            }
        }
    }
}

export function calculateAdjustedQuotient(
    algorithm: AlgorithmType,
    seatsWon: number,
    averageVotesPerSeat: number,
    votes: number,
    firstDivisor: number
): number {
    const quotient = calculateQuotient(algorithm, seatsWon, votes, firstDivisor);

    return quotient / averageVotesPerSeat;
}

export function calculateQuotient(
    algorithm: AlgorithmType,
    seatsWon: number,
    votes: number,
    firstDivisor: number
): number {
    const denominator = getDenominator(
        algorithm,
        seatsWon,
        firstDivisor // When computing the leveling seats, use the unmodified Sainte Lagües
    );

    return votes / denominator;
}

/**
 * Calculates the total number of seats and the average number of votes per seat for each district
 * @param districtResults The district results to finalize
 */
export function finalizeDistrictCalculations(districtResults: Dictionary<DistrictResult>) {
    for (const district in districtResults) {
        if (districtResults.hasOwnProperty(district)) {
            districtResults[district].totalSeats =
                districtResults[district].districtSeats + districtResults[district].levelingSeats;
            districtResults[district].votesPerSeat =
                districtResults[district].votes / districtResults[district].totalSeats;
        }
    }
}

export function calculateFinalQuotients(
    algorithm: AlgorithmType,
    firstDivisor: number,
    adjusted: boolean,
    districtResults: Dictionary<DistrictResult>
) {
    const finalQuotients: DistrictQuotients[] = [];
    for (const districtName in districtResults) {
        if (districtResults.hasOwnProperty(districtName)) {
            const district = districtResults[districtName];

            const districtQuotient: DistrictQuotients = {
                district: district.name,
                levellingSeatRounds: [],
            };

            district.partyResults.forEach((party) => {
                const quotient = adjusted
                    ? calculateAdjustedQuotient(
                          algorithm,
                          party.districtSeats,
                          district.votes / district.districtSeats,
                          party.votes,
                          1
                      )
                    : calculateQuotient(algorithm, party.districtSeats, party.votes, firstDivisor);

                districtQuotient.levellingSeatRounds.push({
                    partyCode: party.partyCode,
                    quotient,
                    wonLevellingSeat: party.levelingSeats > 0,
                });
            });

            finalQuotients.push(districtQuotient);
        }
    }

    return finalQuotients;
}

/**
 * Sorts a list of leveling seats as described here: https://lovdata.no/NL/lov/2002-06-28-57/§11-6
 * @param levelingSeats The list of leveling seats to be sorted
 * @param partyResults A dictionary used to look up how many votes the parties got
 */
export function sortLevelingSeats(levelingSeats: LevelingSeat[], partyResults: Dictionary<PartyResult>) {
    return levelingSeats.sort((v, t) => {
        if (t.quotient !== v.quotient) {
            return t.quotient - v.quotient;
        }

        if (partyResults[t.partyCode].votes !== partyResults[v.partyCode].votes) {
            return partyResults[t.partyCode].votes - partyResults[v.partyCode].votes;
        }

        return Math.random() - 0.5; // Random number between -0.5 and 0.5
    });
}

export function generateLevelingSeatArray(
    algorithm: AlgorithmType,
    levelingPartyCodes: string[],
    partyResults: Dictionary<PartyResult>,
    districtResults: Dictionary<DistrictResult>,
    districtPartyResults: Dictionary<Dictionary<PartyResult>>,
    useAdjustedQuotient: boolean
): LevelingSeat[] {
    let levelingSeats: LevelingSeat[] = [];

    for (const countyName in districtResults) {
        if (districtPartyResults.hasOwnProperty(countyName)) {
            const averageVotesPerSeat = districtResults[countyName].votes / districtResults[countyName].districtSeats;
            for (const partyCode of levelingPartyCodes) {
                const partyResult = districtPartyResults[countyName][partyCode];
                if (partyResult !== undefined) {
                    const adjustedQuotient = useAdjustedQuotient
                        ? calculateAdjustedQuotient(
                              algorithm,
                              partyResult.districtSeats,
                              averageVotesPerSeat,
                              partyResult.votes,
                              1
                          )
                        : calculateQuotient(algorithm, partyResult.districtSeats, partyResult.votes, 1.4);
                    const seat: LevelingSeat = {
                        district: countyName,
                        partyCode,
                        quotient: adjustedQuotient,
                        seatNumber: 0,
                        quotientNumber: 0,
                    };
                    levelingSeats.push(seat);
                }
            }
        }
    }
    levelingSeats = sortLevelingSeats(levelingSeats, partyResults);
    return levelingSeats;
}

/**
 * Converts numerical IDs into their matching algorithm types
 *
 * @param type The numerical ID of the algorithm
 */
export function getAlgorithmType(type: number) {
    switch (type) {
        case 1:
            return AlgorithmType.SAINTE_LAGUE;
        case 2:
            return AlgorithmType.D_HONDT;
        default:
            return AlgorithmType.UNDEFINED;
    }
}

/**
 * Converts numerical IDs into their matching algorithm name
 *
 * @param type The numerical ID of the algorithm
 */
export function getAlgorithmName(type: number) {
    switch (type) {
        case 1:
            return "Sainte-Lagüe";
        case 2:
            return "d'Hondt";
        default:
            return "Udefinert";
    }
}

/**
 * Converts string IDs into their matching algorithm types
 *
 * @param type The string ID of the algorithm
 */
export function getAlgorithmTypeString(type: string) {
    switch (type) {
        case "Sainte Laguës (modified)":
            return AlgorithmType.SAINTE_LAGUE;
        case "d'Hondt":
            return AlgorithmType.D_HONDT;
        default:
            return AlgorithmType.UNDEFINED;
    }
}
