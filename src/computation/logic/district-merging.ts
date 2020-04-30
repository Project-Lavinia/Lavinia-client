import { Election, County, Result, Votes, Metrics } from "../../requested-data/requested-data-models";
import { mapAddFromArray, mapAdd } from "../../utilities/map";

export const districtMap: Map<string, string> = new Map<string, string>([
    ["Nord-Trøndelag", "Trøndelag"],
    ["Sør-Trøndelag", "Trøndelag"],
    ["Hordaland", "Vestland"],
    ["Sogn og Fjordane", "Vestland"],
    ["Aust-Agder", "Agder"],
    ["Vest-Agder", "Agder"],
    ["Vestfold", "Vestfold og Telemark"],
    ["Telemark", "Vestfold og Telemark"],
    ["Oppland", "Innlandet"],
    ["Hedmark", "Innlandet"],
    ["Buskerud", "Viken"],
    ["Akershus", "Viken"],
    ["Østfold", "Viken"],
    ["Troms", "Troms og Finnmark"],
    ["Finnmark", "Troms og Finnmark"],
]);

export function mergeElectionDistricts(election: Election, districtMap: Map<string, string>): Election {
    const { finishedDistricts, groupedDistricts, groupedResults } = groupDistrictsAndResults(
        election.counties,
        districtMap
    );
    const mergedDistricts = mergeDistrictsAndResults(groupedDistricts, groupedResults);
    const result = finishedDistricts.concat(mergedDistricts);

    return {
        algorithm: election.algorithm,
        counties: result,
        countryId: election.countryId,
        electionId: election.electionId,
        electionTypeId: election.electionTypeId,
        firstDivisor: election.firstDivisor,
        levelingSeats: election.levelingSeats,
        seats: election.seats,
        threshold: election.threshold,
        year: election.year,
    };
}

function groupDistrictsAndResults(
    districts: County[],
    districtMap: Map<string, string>
): {
    finishedDistricts: County[];
    groupedDistricts: Map<string, County[]>;
    groupedResults: Map<string, Map<string, Result[]>>;
} {
    const finishedDistricts: County[] = [];
    let groupedDistricts = new Map<string, County[]>();
    const groupedResults = new Map<string, Map<string, Result[]>>();

    for (let i = 0, n = districts.length; i < n; i++) {
        const currentDistrict = districts[i];
        const newName = districtMap.get(currentDistrict.name);

        if (newName === undefined) {
            finishedDistricts.push(currentDistrict);
        } else {
            if (!groupedResults.has(newName)) {
                groupedResults.set(newName, new Map<string, Result[]>());
            }
            let results = groupedResults.get(newName);
            if (results !== undefined) {
                results = mapAddFromArray(results, getKeyFromResult, currentDistrict.results);
                groupedResults.set(newName, results);
            }
            groupedDistricts = mapAdd(groupedDistricts, newName, currentDistrict);
        }
    }

    return {
        finishedDistricts,
        groupedDistricts,
        groupedResults,
    };
}

function getKeyFromResult(result: Result): string {
    return result.partyCode;
}

function mergeDistrictsAndResults(
    groupedDistricts: Map<string, County[]>,
    groupedResults: Map<string, Map<string, Result[]>>
): County[] {
    const finishedDistricts: County[] = [];

    groupedDistricts.forEach((districtArray, districtName) => {
        const resultMap = groupedResults.get(districtName);

        if (resultMap !== undefined) {
            const districtResults = mergeResults(resultMap, districtName);
            const mergedDistrict = districtArray.reduce(districtReducer);
            mergedDistrict.name = districtName;
            mergedDistrict.results = districtResults;
            finishedDistricts.push(mergedDistrict);
        }
    });

    return finishedDistricts;
}

function mergeResults(resultMap: Map<string, Result[]>, districtName: string): Result[] {
    const districtResults: Result[] = [];

    resultMap.forEach((partyResults, _) => {
        const mergedPartyResults = partyResults.reduce(resultReducer);
        mergedPartyResults.countyName = districtName;
        districtResults.push(mergedPartyResults);
    });

    return districtResults;
}

function resultReducer(result: Result, current: Result): Result {
    return {
        countyId: current.countyId,
        countyName: "PLACEHOLDER",
        electionId: current.electionId,
        partyCode: current.partyCode,
        partyId: current.partyId,
        partyName: current.partyName,
        percentage: result.percentage + current.percentage,
        resultId: current.resultId,
        votes: result.votes + current.votes,
    };
}

function districtReducer(result: County, current: County): County {
    return {
        countryId: current.countryId,
        countyId: current.countyId,
        electionId: current.electionId,
        name: "PLACEHOLDER",
        results: [],
        seats: result.seats + current.seats,
    };
}

export function mergeVoteDistricts(votes: Votes[], districtMap: Map<string, string>): Votes[] {
    const { finishedVotes, groupedVotes } = groupVotes(votes, districtMap);
    const mergedVotes = mergeVotes(groupedVotes);
    const result = finishedVotes.concat(mergedVotes);

    return result;
}

function groupVotes(
    votes: Votes[],
    districtMap: Map<string, string>
): { finishedVotes: Votes[]; groupedVotes: Map<string, Map<string, Votes[]>> } {
    const finishedVotes: Votes[] = [];
    const groupedVotes = new Map<string, Map<string, Votes[]>>();

    for (let i = 0, n = votes.length; i < n; i++) {
        const currentVote = votes[i];
        const newName = districtMap.get(currentVote.district);

        if (newName === undefined) {
            finishedVotes.push(currentVote);
        } else {
            if (!groupedVotes.has(newName)) {
                groupedVotes.set(newName, new Map<string, Votes[]>());
            }
            let votes = groupedVotes.get(newName);
            if (votes !== undefined) {
                votes = mapAdd(votes, currentVote.party, currentVote);
                groupedVotes.set(newName, votes!);
            }
        }
    }

    return {
        finishedVotes,
        groupedVotes,
    };
}

function mergeVotes(groupedVotes: Map<string, Map<string, Votes[]>>): Votes[] {
    const votes: Votes[] = [];

    groupedVotes.forEach((districtVotes, districtName) => {
        districtVotes.forEach((partyVotes, _) => {
            const mergedPartyResults = partyVotes.reduce(votesReducer);
            mergedPartyResults.district = districtName;
            votes.push(mergedPartyResults);
        });
    });

    return votes;
}

function votesReducer(result: Votes, current: Votes): Votes {
    return {
        district: "PLACEHOLDER",
        electionType: current.electionType,
        electionYear: current.electionYear,
        party: current.party,
        votes: result.votes + current.votes,
    };
}

export function mergeMetricDistricts(metrics: Metrics[], districtMap: Map<string, string>): Metrics[] {
    const { finishedMetrics, groupedMetrics } = groupMetrics(metrics, districtMap);
    const mergedMetrics = mergeMetrics(groupedMetrics);
    const result = finishedMetrics.concat(mergedMetrics);

    return result;
}

function groupMetrics(
    metrics: Metrics[],
    districtMap: Map<string, string>
): { finishedMetrics: Metrics[]; groupedMetrics: Map<string, Metrics[]> } {
    const finishedMetrics: Metrics[] = [];
    let groupedMetrics = new Map<string, Metrics[]>();

    for (let i = 0, n = metrics.length; i < n; i++) {
        const currentMetric = metrics[i];
        const newName = districtMap.get(currentMetric.district);

        if (newName === undefined) {
            finishedMetrics.push(currentMetric);
        } else {
            groupedMetrics = mapAdd(groupedMetrics, newName, currentMetric);
        }
    }

    return {
        finishedMetrics,
        groupedMetrics,
    };
}

function mergeMetrics(groupedMetrics: Map<string, Metrics[]>): Metrics[] {
    const metrics: Metrics[] = [];

    groupedMetrics.forEach((districtMetrics, districtName) => {
        const mergedMetrics = districtMetrics.reduce(metricReducer);
        mergedMetrics.district = districtName;
        metrics.push(mergedMetrics);
    });

    return metrics;
}

function metricReducer(result: Metrics, current: Metrics): Metrics {
    return {
        area: result.area + current.area,
        district: current.district,
        electionYear: current.electionYear,
        population: result.population + current.population,
        seats: result.seats + current.seats,
    };
}
