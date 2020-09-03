import { SortedReverseDict, KeyValuePair } from "./sorted-reverse-dict";
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
        this.insert(partyCode, quotient);
    }

    /**
     * Returns the party with the highest quotient.
     * Breaks ties according to the Norwegian laws.
     *
     * @param partyVotes Number of votes received by each party
     */
    getWinner(partyVotes: _.Dictionary<number>): KeyValuePair {
        const winners = this.popTop();
        let winner: KeyValuePair;

        // If more than 1 districts share the lead
        if (winners.length > 1) {
            // Select a winner
            winner = breakTies(winners, partyVotes);

            // Return the losers back into the distribution
            winners.forEach((entry) => {
                if (entry.key !== winner.key) {
                    this.insert(entry.key, entry.value);
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
     * @param partyVotes Number of votes received by each party
     */
    populateQuotients(distribution: _.Dictionary<number>, partyVotes: _.Dictionary<number>) {
        for (const entry in distribution) {
            if (distribution.hasOwnProperty(entry)) {
                this.insertParty(entry, partyVotes[entry], distribution[entry]);
            }
        }
    }
}
