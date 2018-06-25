import { Election } from "./Election";

export interface ElectionType {
    countryId: number;
    electionTypeId: number;
    elections: Election[];
    internationalName: string;
}