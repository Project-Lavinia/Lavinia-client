import { ElectionType, Votes, Metrics, Parameters } from "./requested-data-models";
import { Dictionary } from "utilities/dictionary";

export interface RequestedDataState {
    dataLoaded: boolean;
    enableAutoSave: boolean;
    electionType: ElectionType;
    votes: Votes[];
    metrics: Metrics[];
    parameters: Parameters[];
    partyMap: Dictionary<string>
}

export const unloadedState: RequestedDataState = {
    dataLoaded: false,
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
    partyMap: {},
};
