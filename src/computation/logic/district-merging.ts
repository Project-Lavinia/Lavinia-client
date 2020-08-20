import { Votes, Metrics } from "../../requested-data/requested-data-models";
import { mapAdd } from "../../utilities/map";

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
        const currentVote = { ...votes[i] };
        const newName = districtMap.get(currentVote.district);

        if (newName === undefined) {
            finishedVotes.push(currentVote);
        } else {
            if (!groupedVotes.has(newName)) {
                groupedVotes.set(newName, new Map<string, Votes[]>());
            }
            let voteMap = groupedVotes.get(newName);
            if (voteMap) {
                voteMap = mapAdd(voteMap, currentVote.party, currentVote);
                groupedVotes.set(newName, voteMap!);
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
