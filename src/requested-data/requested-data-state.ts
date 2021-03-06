import { Votes, Metrics, Parameters } from "./requested-data-models";

export interface RequestedDataState {
    dataLoaded: boolean;
    enableAutoSave: boolean;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
    partyMap: _.Dictionary<string>;
}

export const unloadedState: RequestedDataState = {
    dataLoaded: false,
    enableAutoSave: false,
    votes: [],
    metrics: [],
    parameters: [],
    partyMap: {},
};
