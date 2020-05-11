import { SortedReverseDict, KeyValuePair } from "./sorted-reverse-dict";
import { Dictionary } from "../../utilities/dictionary";
import { breakTies } from "./utils";

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
            winner = breakTies(winners, baseValue);

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
}
