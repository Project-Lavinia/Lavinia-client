import {
    AlgorithmType,
    SeatResult,
    PartyResult,
    DistributionResult,
    DistrictResult,
    LevelingSeat,
    DistrictQuotients,
} from "..";
import { SeatPartyResult } from "./../../computation/computation-models";
import * as _ from "lodash";
import { largestFraction } from "./distribution";
import { checkExhaustively } from "../../utilities";
import { Votes } from "../../requested-data/requested-data-models";
import { calculatePercent } from "../../utilities/number";

const illegalPartyCodes = new Set(["BLANKE"]);

export function constructDistrictResults(
    districtSeats: _.Dictionary<number>,
    districtVotes: _.Dictionary<number>,
    totalVotes: number
): _.Dictionary<DistrictResult> {
    const districtResults: _.Dictionary<DistrictResult> = {};
    for (const district in districtSeats) {
        if (districtSeats.hasOwnProperty(district)) {
            districtResults[district] = {
                name: district,
                districtSeats: districtSeats[district],
                levelingSeats: 0,
                totalSeats: 0,
                votes: districtVotes[district],
                percentVotes: calculatePercent(districtVotes[district], totalVotes),
                votesPerSeat: 0,
                districtSeatResult: [],
                partyResults: [],
            };
        }
    }

    return districtResults;
}

export function constructPartyResults(
    votes: Votes[],
    totalVotes: number,
    partyMap: _.Dictionary<string>
): _.Dictionary<PartyResult> {
    const partyResults: _.Dictionary<PartyResult> = {};

    for (const vote of votes) {
        if (vote.party in partyResults) {
            partyResults[vote.party].votes += vote.votes;
        } else {
            partyResults[vote.party] = {
                partyCode: vote.party,
                partyName: partyMap[vote.party],
                votes: vote.votes,
                percentVotes: 0,
                districtSeats: 0,
                levelingSeats: 0,
                totalSeats: 0,
                proportionality: 0,
            };
        }
    }

    for (const partyCode in partyResults) {
        if (partyResults.hasOwnProperty(partyCode)) {
            const votes = partyResults[partyCode].votes;
            partyResults[partyCode].percentVotes = calculatePercent(votes, totalVotes);
        }
    }

    return partyResults;
}

function addMissingParties(
    districtPartyResults: _.Dictionary<_.Dictionary<PartyResult>>,
    partyCodes: Set<string>,
    partyMap: _.Dictionary<string>)
{
    for (const districtName in districtPartyResults) {
        if (!districtPartyResults.hasOwnProperty(districtName)) {
            continue;
        }

        for (const partyCode of Array.from(partyCodes)) {
            if (districtPartyResults[districtName].hasOwnProperty(partyCode)) {
                continue;
            }

            districtPartyResults[districtName][partyCode] = {
                partyCode,
                partyName: partyMap[partyCode],
                votes: 0,
                percentVotes: 0,
                districtSeats: 0,
                levelingSeats: 0,
                totalSeats: 0,
                proportionality: 0,
            };
        }
    }

    return districtPartyResults;
}

export function constructDistrictPartyResults(
    votes: Votes[],
    districtVotes: _.Dictionary<number>,
    partyMap: _.Dictionary<string>
): _.Dictionary<_.Dictionary<PartyResult>> {
    const districtPartyResults: _.Dictionary<_.Dictionary<PartyResult>> = {};
    const partyCodes: Set<string> = new Set();

    for (const vote of votes) {
        partyCodes.add(vote.party);

        if (!districtPartyResults[vote.district]) {
            districtPartyResults[vote.district] = {};
        }
        districtPartyResults[vote.district][vote.party] = {
            partyCode: vote.party,
            partyName: partyMap[vote.party],
            votes: vote.votes,
            percentVotes: calculatePercent(vote.votes, districtVotes[vote.district]),
            districtSeats: 0,
            levelingSeats: 0,
            totalSeats: 0,
            proportionality: 0,
        };
    }

    return addMissingParties(districtPartyResults, partyCodes, partyMap);
}

export function getVotesPerDistrict(votes: Votes[]): _.Dictionary<number> {
    const voteCount: _.Dictionary<number> = {};
    for (const vote of votes) {
        if (vote.district in voteCount) {
            voteCount[vote.district] += vote.votes;
        } else {
            voteCount[vote.district] = vote.votes;
        }
    }

    return voteCount;
}

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
    totalVotes: number,
    results: _.Dictionary<PartyResult>,
    averageVotesPerSeat?: number,
    partyResults?: _.Dictionary<PartyResult>
): DistributionResult {
    if (isLargestFractionAlgorithm(algorithm)) {
        const electionNumber = getElectionNumber(algorithm, totalVotes, numSeats);
        const partyVotes = resultArrayToDictionary(results);
        return largestFraction(numSeats, partyVotes, electionNumber);
    }

    const seatsWon: _.Dictionary<number> = {};
    const currentSeatsWon: _.Dictionary<number> = {};
    const seatResults: SeatResult[] = [];

    if (partyResults === undefined) {
        for (const partyCode in results) {
            if (results.hasOwnProperty(partyCode)) {
                const vote = results[partyCode];
                seatsWon[vote.partyCode] = 0;
                currentSeatsWon[vote.partyCode] = 0;
            }
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

        let tiedSeatWinners = [
            {
                partyCode: "",
                quotient: -1,
                denominator: -1,
                votes: -1,
            },
        ];

        for (const partyCode in results) {
            if (Object.prototype.hasOwnProperty.call(results, partyCode)) {
                const result = results[partyCode];

                const currentDenominator = getDenominator(
                    algorithm,
                    seatsWon[partyCode],
                    firstDivisor,
                    numSeats,
                    totalVotes
                );
                const currentQuotient =
                    averageVotesPerSeat != null
                        ? calculateAdjustedQuotient(
                              algorithm,
                              seatsWon[partyCode],
                              averageVotesPerSeat,
                              result.votes,
                              firstDivisor,
                              numSeats,
                              totalVotes
                          )
                        : calculateQuotient(
                              algorithm,
                              seatsWon[partyCode],
                              result.votes,
                              firstDivisor,
                              numSeats,
                              totalVotes
                          );
                const currentPartyResult = {
                    partyCode,
                    quotient: currentQuotient,
                    denominator: currentDenominator,
                    votes: result.votes,
                };
                seatResult.partyResults.push(currentPartyResult);

                if (!illegalPartyCodes.has(partyCode) && result.percentVotes > districtThreshold) {
                    tiedSeatWinners = updateWinners(tiedSeatWinners, currentPartyResult);
                }
            }
        }

        const winner = _.sample(tiedSeatWinners);
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
export function getDenominator(
    algorithm: AlgorithmType,
    numberOfSeatsAssigned: number,
    firstDivisor: number,
    totalSeats: number,
    totalVotes: number
) {
    switch (algorithm) {
        case AlgorithmType.SAINTE_LAGUE:
            if (numberOfSeatsAssigned === 0) {
                return firstDivisor;
            } else {
                return 2 * numberOfSeatsAssigned + 1;
            }
        case AlgorithmType.D_HONDT:
            return numberOfSeatsAssigned + 1;
        case AlgorithmType.LARGEST_FRACTION_HARE:
        case AlgorithmType.LARGEST_FRACTION_DROOP:
        case AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF:
            return getElectionNumber(algorithm, totalVotes, totalSeats);
        case AlgorithmType.UNDEFINED:
            console.error(`ERROR! Algorithm type should not be undefined!`);
            return Number.MIN_SAFE_INTEGER;
        default:
            checkExhaustively(algorithm);
            return Number.MIN_SAFE_INTEGER;
    }
}

function getElectionNumber(algorithm: AlgorithmType, totalVotes: number, totalSeats: number): number {
    switch (algorithm) {
        case AlgorithmType.LARGEST_FRACTION_HARE:
            return Math.floor(totalVotes / totalSeats);
        case AlgorithmType.LARGEST_FRACTION_DROOP:
            return Math.floor(totalVotes / (totalSeats + 1)) + 1;
        case AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF:
            return Math.floor(totalVotes / (totalSeats + 1));
        default:
            console.error(`ERROR! ${algorithm.toString()} does not have an associated election number algorithm!`);
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
    partyResults: _.Dictionary<PartyResult>,
    districtPartyResults: _.Dictionary<_.Dictionary<PartyResult>>,
    districtResults: _.Dictionary<DistrictResult>
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
    firstDivisor: number,
    totalSeats: number,
    totalVotes: number
): number {
    const quotient = calculateQuotient(algorithm, seatsWon, votes, firstDivisor, totalSeats, totalVotes);

    return quotient / averageVotesPerSeat;
}

export function calculateQuotient(
    algorithm: AlgorithmType,
    seatsWon: number,
    votes: number,
    firstDivisor: number,
    totalSeats: number,
    totalVotes: number
): number {
    const denominator = getDenominator(
        algorithm,
        seatsWon,
        firstDivisor, // When computing the leveling seats, use the unmodified Sainte Lagües
        totalSeats,
        totalVotes
    );

    return votes / denominator;
}

/**
 * Calculates the total number of seats and the average number of votes per seat for each district
 * @param districtResults The district results to finalize
 */
export function finalizeDistrictCalculations(districtResults: _.Dictionary<DistrictResult>) {
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
    districtResults: _.Dictionary<DistrictResult>
): DistrictQuotients[] {
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
                          firstDivisor,
                          district.districtSeats,
                          district.votes
                      )
                    : calculateQuotient(
                          algorithm,
                          party.districtSeats,
                          party.votes,
                          firstDivisor,
                          district.districtSeats,
                          district.votes
                      );

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
 * @param partyResults A _.Dictionary used to look up how many votes the parties got
 */
export function sortLevelingSeats(levelingSeats: LevelingSeat[], partyResults: _.Dictionary<PartyResult>) {
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
    partyResults: _.Dictionary<PartyResult>,
    districtResults: _.Dictionary<DistrictResult>,
    districtPartyResults: _.Dictionary<_.Dictionary<PartyResult>>,
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
                              1,
                              districtResults[countyName].levelingSeats,
                              districtResults[countyName].votes
                          )
                        : calculateQuotient(
                              algorithm,
                              partyResult.districtSeats,
                              partyResult.votes,
                              1.4,
                              districtResults[countyName].levelingSeats,
                              districtResults[countyName].votes
                          );
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
 * Converts an array of results to a Dictionary from Party Code to Votes.
 *
 * @param results An array of results
 */
function resultArrayToDictionary(results: _.Dictionary<PartyResult>): _.Dictionary<number> {
    const resultDict: _.Dictionary<number> = {};
    for (const partyCode in results) {
        if (results.hasOwnProperty(partyCode)) {
            const partyVotes = results[partyCode];
            resultDict[partyVotes.partyCode] = partyVotes.votes;
        }
    }

    return resultDict;
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
        case 3:
            return AlgorithmType.LARGEST_FRACTION_HARE;
        case 4:
            return AlgorithmType.LARGEST_FRACTION_DROOP;
        case 5:
            return AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF;
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
            return "Sainte-Laguë";
        case 2:
            return "d'Hondt";
        case 3:
            return "Største brøk (Hare)";
        case 4:
            return "Største brøk (Droop)";
        case 5:
            return "Største brøk (Hagenbach-Bischoff)";
        default:
            return "Udefinert";
    }
}

/**
 * Converts AlgorithmTypes into their matching algorithm name
 *
 * @param type The AlgorithmType of the algorithm
 */
export function getAlgorithmNameFromType(type: AlgorithmType) {
    switch (type) {
        case AlgorithmType.SAINTE_LAGUE:
            return "Sainte-Laguë";
        case AlgorithmType.D_HONDT:
            return "d'Hondt";
        case AlgorithmType.LARGEST_FRACTION_HARE:
            return "Største brøk (Hare)";
        case AlgorithmType.LARGEST_FRACTION_DROOP:
            return "Største brøk (Droop)";
        case AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF:
            return "Største brøk (Hagenbach-Bischoff)";
        case AlgorithmType.UNDEFINED:
            return "Udefinert";
        default:
            checkExhaustively(type);
            return "";
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
        case "Largest fraction (Hare)":
            return AlgorithmType.LARGEST_FRACTION_HARE;
        case "Largest fraction (Droop)":
            return AlgorithmType.LARGEST_FRACTION_DROOP;
        case "Largest fraction (Hagenbach-Bischoff)":
            return AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF;
        default:
            return AlgorithmType.UNDEFINED;
    }
}

/**
 * Checks whether an algorithm is a quotient type algorithm. (eg. Sainte Laguës or d'Hondt)
 *
 * @param algorithm The algorithm to check
 */
export function isQuotientAlgorithm(algorithm: AlgorithmType): boolean {
    return algorithm === AlgorithmType.SAINTE_LAGUE || algorithm === AlgorithmType.D_HONDT;
}

/**
 * Checks whether an algorithm is a largest fraction type algorithm (eg. Hare, Droop or Hagenbach-Bischoff)
 *
 * @param algorithm The algorithm to check
 */
export function isLargestFractionAlgorithm(algorithm: AlgorithmType): boolean {
    return (
        algorithm === AlgorithmType.LARGEST_FRACTION_DROOP ||
        algorithm === AlgorithmType.LARGEST_FRACTION_HARE ||
        algorithm === AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF
    );
}
