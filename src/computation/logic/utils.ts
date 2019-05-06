import { Dictionary, copyDictionary } from "../../utilities/dictionary";
import { DistrictResultv2, PartyResultv2, NationalPartyResult, ComputationPayload } from "..";
import { Metrics } from "../../requested-data/requested-data-models";
import { sainteLagues, distributionByQuotient } from "./distribution";

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

        // IMPORTANT! Assuming 19 leveling seats! Needs to be fixed
        districtSeats = distributionByQuotient(numDistrictSeats + 19, districtSeats, baseValues, denominatorFunction);
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
