import { PartyResult } from "./PartyResult";
import { DistrictResult } from "./DistrictResult";
import { PartyRestQuotients } from "./PartyRestQuotients";

export interface LagueDhontResult {
    /** A list of party results, with information about national results */
    partyResults: PartyResult[];
    /** A list of district results, with information about district-level results */
    districtResults: DistrictResult[];
    /** A list of information regarding the distribution of the leveling seats */
    levelingSeatDistribution: PartyRestQuotients[];
}
