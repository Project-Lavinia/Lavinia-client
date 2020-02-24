import { ElectionType, Votes, Metrics, Parameters } from "./requested-data-models";

export interface RequestedDataState {
    enableAutoSave: boolean;
    electionType: ElectionType;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
}

export const unloadedState: RequestedDataState = {
    enableAutoSave: false,
    electionType: {
        countryId: -1,
        electionTypeId: -1,
        internationalName: "UNDEFINED",
        elections: [],
    },
    votes: [],
    metrics: [],
    parameters: [],
};
