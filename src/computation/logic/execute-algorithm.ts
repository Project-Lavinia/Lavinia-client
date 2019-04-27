import { ComputationPayload, DistrictResultv2, PartyResultv2, NationalPartyResult } from "../computation-models";
import { Dictionary } from "../../utilities/dictionary";
import { buildDistrictResults, sumAllVotes, calculatePercentages } from "./utils";

export function lagueDhont(payload: ComputationPayload) {
    const districtResults: Dictionary<DistrictResultv2> = buildDistrictResults(payload.metrics);
    const partyResults: Dictionary<Dictionary<PartyResultv2>> = {};
    const nationalPartyResults: Dictionary<NationalPartyResult> = {};

    sumAllVotes(payload, districtResults, partyResults, nationalPartyResults);
    calculatePercentages(payload.parameters.totalVotes, districtResults, partyResults, nationalPartyResults);
}
