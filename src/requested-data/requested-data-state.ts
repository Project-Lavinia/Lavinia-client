import { Votes, Metrics, Parameters } from "./requested-data-models";
import { Dictionary } from "../utilities/dictionary";

export interface RequestedDataState {
    dataLoaded: boolean;
    enableAutoSave: boolean;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
    partyMap: Dictionary<string>;
}

export const unloadedState: RequestedDataState = {
    dataLoaded: false,
    enableAutoSave: false,
    votes: [],
    metrics: [],
    parameters: [],
    partyMap: {},
};
