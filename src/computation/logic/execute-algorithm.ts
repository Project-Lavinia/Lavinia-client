import { ComputationPayload, DistrictResultv2, PartyResultv2, NationalPartyResult } from "../computation-models";
import { buildDistrictResults, sumAllVotes, calculatePercentages } from "./utils";

export function lagueDhont(payload: ComputationPayload) {
    const districtResults: _.Dictionary<DistrictResultv2> = buildDistrictResults(payload.metrics);
    const partyResults: _.Dictionary<_.Dictionary<PartyResultv2>> = {};
    const nationalPartyResults: _.Dictionary<NationalPartyResult> = {};

    sumAllVotes(payload, districtResults, partyResults, nationalPartyResults);
    calculatePercentages(payload.parameters.totalVotes, districtResults, partyResults, nationalPartyResults);
}
