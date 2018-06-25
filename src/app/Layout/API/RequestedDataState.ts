import { ElectionType } from "../Interfaces/Models";

export interface RequestedDataState {
    enableAutoSave: boolean;
    electionType: ElectionType;
}

export const unloadedState: RequestedDataState = {
    enableAutoSave: false,
    electionType: {
        countryId: -1,
        electionTypeId: -1,
        internationalName: "UNDEFINED",
        elections: []
    }
};