import { RawAlgorithm, Algorithm, RawParameters, Parameters } from "./requested-data-models";
import { rawDictionaryToDictionary } from "../utilities/dictionary";

export function rawAlgorithmToAlgorithmConverter(rawAlgorithm: RawAlgorithm): Algorithm {
    const algorithm: Algorithm = {
        algorithm: rawAlgorithm.algorithm,
        id: rawAlgorithm.id,
        parameters: rawDictionaryToDictionary(rawAlgorithm.parameters),
    };

    return algorithm;
}

export function rawParametersToParametersConverter(rawParameters: RawParameters): Parameters {
    const parameters: Parameters = {
        algorithm: rawAlgorithmToAlgorithmConverter(rawParameters.algorithm),
        areaFactor: rawParameters.areaFactor,
        districtSeats: rawDictionaryToDictionary(rawParameters.districtSeats),
        electionType: rawParameters.electionType,
        electionYear: rawParameters.electionYear,
        levelingSeats: rawParameters.levelingSeats,
        threshold: rawParameters.threshold,
        totalVotes: rawParameters.totalVotes,
    };

    return parameters;
}
