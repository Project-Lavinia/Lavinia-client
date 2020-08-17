import { Votes, Metrics } from "../requested-data/requested-data-models";
import { reform2005Applies } from "./conditionals";

export function getVotesForYear(votes: Votes[], year: number): Votes[] {
    return votes.filter((vote) => vote.electionYear === year);
}

export function getMetricsForYear(metrics: Metrics[], year: number): Metrics[] {
    return metrics.filter((metric) => metric.electionYear === year);
}

export function getMetricsYear(use2021Distribution: boolean, year: number): number {
    return use2021Distribution && reform2005Applies(year) ? 2021 : year;
}