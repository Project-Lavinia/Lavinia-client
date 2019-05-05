import { copyDictionary, Dictionary } from "../../utilities/dictionary";
import { SortedReverseDict, KeyValuePair } from "./sorted-reverse-dict";

/**
 * A general function for distributing a number of items on a number of names based on updated quotients.
 *
 * Each time a name wins an item, their count of items won is updated.
 * Subsequently the denominator used to calculate their quotient is updated to reflect their win on whether or not they will win following items.
 *
 * @param numberToDistribute Number of items to distribute
 * @param distributeOn A dictionary of names to distribute on, if there is already a partial distribution the values in this dictionary will be used as a starting point for how many items they have already received
 * @param baseValue The value used as the numerator for each name
 * @param denominatorFunction The function used to select the denominator to be used depending on how many items each name has won
 */
export function distributionByQuotient(
    numberToDistribute: number,
    distributeOn: Dictionary<number>,
    baseValue: Dictionary<number>,
    denominatorFunction: (timesWon: number) => number
): Dictionary<number> {
    const updatedDistribution = copyDictionary(distributeOn);
    const sortedQuotients = new SortedReverseDict();

    // Fill the sortedQuotients with all the entries expected to have the starting list fully sorted
    for (const entry in updatedDistribution) {
        if (updatedDistribution.hasOwnProperty(entry)) {
            const quotient = baseValue[entry] / denominatorFunction(updatedDistribution[entry]);
            sortedQuotients.insert({ key: entry, value: quotient });
        }
    }

    // Begin drawing winners
    for (let distributionIndex = 0; distributionIndex < numberToDistribute; distributionIndex++) {
        // Get winner (potentially more than 1)
        const winners = sortedQuotients.popTop();
        let winner: KeyValuePair;

        // If more than 1 districts share the lead
        if (winners.length > 1) {
            // Select a winner
            winner = tieBreaker(winners, baseValue);

            // Return the losers back into the distribution
            winners.map((entry) => {
                if (entry.key !== winner.key) {
                    sortedQuotients.insert(entry);
                }
            });
        } else {
            winner = winners[0];
        }

        updatedDistribution[winner.key]++;

        // Calculate new quotient
        const quotient = baseValue[winner.key] / denominatorFunction(updatedDistribution[winner.key]);
        sortedQuotients.insert({ key: winner.key, value: quotient });
    }

    return updatedDistribution;
}

/**
 * Breaks ties in the distribution of items on names
 *
 * @param winners The list of multiple winners from the distribution stage
 * @param baseValue The dictionary from winners to their respective numerators
 */
function tieBreaker(winners: KeyValuePair[], baseValue: Dictionary<number>): KeyValuePair {
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

/**
 * Denominator function for Sainte Lagues
 * @param numberOfSeatsAssigned The number of seats the party or district has won
 * @param firstDivisor The first divisor to be used if the party or district has not won any seats yet
 */
export function sainteLagues(numberOfSeatsAssigned: number, firstDivisor: number): number {
    if (numberOfSeatsAssigned === 0) {
        return firstDivisor;
    } else {
        return 2 * numberOfSeatsAssigned + 1;
    }
}

/**
 * Denominator function for d'Hondt
 * @param numberOfSeatsAssigned The number of seats the party or district has won
 */
export function dHondt(numberOfSeatsAssigned: number): number {
    return numberOfSeatsAssigned + 1;
}
