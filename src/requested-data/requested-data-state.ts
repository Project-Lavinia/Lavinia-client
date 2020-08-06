import { Votes, Metrics, Parameters } from "./requested-data-models";

export interface RequestedDataState {
    dataLoaded: boolean;
    enableAutoSave: boolean;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
    partyMap: Map<string, string>;
}

export const unloadedState: RequestedDataState = {
    dataLoaded: false,
    enableAutoSave: false,
    votes: [],
    metrics: [],
    parameters: [],
    partyMap: new Map<string, string>(),
};
