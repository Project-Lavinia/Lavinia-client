import { SortedReverseDict, KeyValuePair } from "./sorted-reverse-dict";
import { Dictionary } from "utilities/dictionary";

export class QuotientDictionary extends SortedReverseDict {
    denominatorFunction: (timesWon: number) => number;

    constructor(denominatorFunction: (timesWon: number) => number) {
        super();
        this.denominatorFunction = denominatorFunction;
    }

    /**
     * Calculates the quotient of the party and sorts it into the party quotient dictionary.
     *
     * @param partyCode The party code for a party
     * @param votes Number of votes the party received
     * @param timesWon Number of seats won by the party
     */
    insertParty(partyCode: string, votes: number, timesWon: number) {
        const quotient = votes / this.denominatorFunction(timesWon);
        this.insert({ key: partyCode, value: quotient });
    }

    /**
     * Returns the party with the highest quotient.
     * Breaks ties according to the Norwegian laws.
     *
     * @param baseValue Number of votes received by each party
     */
    getWinner(baseValue: Dictionary<number>): KeyValuePair {
        const winners = this.popTop();
        let winner: KeyValuePair;

        // If more than 1 districts share the lead
        if (winners.length > 1) {
            // Select a winner
            winner = this.tieBreaker(winners, baseValue);

            // Return the losers back into the distribution
            winners.forEach((entry) => {
                if (entry.key !== winner.key) {
                    this.insert(entry);
                }
            });
        } else {
            winner = winners[0];
        }

        return winner;
    }

    /**
     * Calculates the quotients of every party and sorts them into the party quotient dictionary.
     *
     * @param distribution Number of seats won by each party
     * @param baseValue Number of votes received by each party
     */
    populateQuotients(distribution: Dictionary<number>, baseValue: Dictionary<number>) {
        for (const entry in distribution) {
            if (distribution.hasOwnProperty(entry)) {
                this.insertParty(entry, baseValue[entry], distribution[entry]);
            }
        }
    }

    /**
     * Breaks ties in the distribution of items on names
     *
     * @param winners The list of multiple winners from the distribution stage
     * @param baseValue The dictionary from winners to their respective numerators
     */
    tieBreaker(winners: KeyValuePair[], baseValue: Dictionary<number>): KeyValuePair {
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
}
