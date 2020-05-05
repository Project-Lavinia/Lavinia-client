import { RawAlgorithm, Algorithm, RawParameters, Parameters } from "./requested-data-models";
import { rawDictionaryToDictionary } from "../utilities/dictionary";
import { getAlgorithmTypeString } from "../computation/logic";

export function rawAlgorithmToAlgorithmConverter(rawAlgorithm: RawAlgorithm): Algorithm {
    const algorithm: Algorithm = {
        algorithm: getAlgorithmTypeString(rawAlgorithm.algorithm),
        parameters: rawDictionaryToDictionary(rawAlgorithm.parameters),
    };

    return algorithm;
}

export function rawParametersToParametersConverter(rawParameters: RawParameters): Parameters {
    const parameters: Parameters = {
        algorithm: rawAlgorithmToAlgorithmConverter(rawParameters.algorithm),
        areaFactor: rawParameters.areaFactor,
        districtSeats: rawParameters.districtSeats,
        electionType: rawParameters.electionType,
        electionYear: rawParameters.electionYear,
        levelingSeats: rawParameters.levelingSeats,
        threshold: rawParameters.threshold,
        totalVotes: rawParameters.totalVotes,
    };

    return parameters;
}
