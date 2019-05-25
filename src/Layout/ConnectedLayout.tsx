import { LayoutProps, Layout } from "./Layout";
import { connect } from "react-redux";
import { request } from "../utilities/api-requests";
import { ElectionType, Votes, Metrics, RawParameters, Parameters } from "../requested-data/requested-data-models";
import {
    initializeRequestedData,
    initializeRequestedVotes,
    initializeRequestedMetrics,
    InitializeRequestedParameters,
} from "../requested-data";
import { initializeComputation } from "../computation";
import { initializeComputationMenu } from "./ComputationMenu";
import { initializePresentation } from "./PresentationMenu";
import { stateIsInvalid } from "../store/version";
import { rawParametersToParametersConverter } from "../requested-data/requested-data-utilities";

const mapDispatchToProps = (dispatch: any): LayoutProps => ({
    initializeState: async () => {
        const electionTypePath = "no/pe?deep=true";
        let defaultUri: string;

        const votesPath = "votes/previous?number=3&partyCode=ALL&district=ALL";
        const metricsPath = "metrics/previous?number=3&partyCode=ALL&district=ALL";
        const parametersPath = "parameters/previous?number=3";
        let votesUri: string;
        let metricsUri: string;
        let parametersUri: string;

        defaultUri = process.env.API_V1 + electionTypePath;

        votesUri = process.env.API_V2 + votesPath;
        metricsUri = process.env.API_V2 + metricsPath;
        parametersUri = process.env.API_V2 + parametersPath;

        const failover: ElectionType = {
            internationalName: "UNDEFINED",
            electionTypeId: -1,
            countryId: -1,
            elections: [],
        };
        if (stateIsInvalid()) {
            const votes = await request<Array<Votes>>(votesUri, []);
            const initializeRequestedVotesAction = initializeRequestedVotes(votes);
            dispatch(initializeRequestedVotesAction);

            const metrics = await request<Array<Metrics>>(metricsUri, []);
            const initializeRequestedMetricsAction = initializeRequestedMetrics(metrics);
            dispatch(initializeRequestedMetricsAction);

            const rawParameters = await request<Array<RawParameters>>(parametersUri, []);
            const parameters = rawParameters.map<Parameters>((raw) => rawParametersToParametersConverter(raw));
            const initializeRequestedParametersAction = InitializeRequestedParameters(parameters);
            dispatch(initializeRequestedParametersAction);

            const electionType = await request<ElectionType>(defaultUri, failover);
            const initializeRequestDataAction = initializeRequestedData(electionType);

            const initializeSettingsAction = initializeComputationMenu(electionType, parameters[0]);
            const initializePresentationAction = initializePresentation();
            dispatch(initializeRequestDataAction);
            dispatch(initializePresentationAction);
            dispatch(initializeSettingsAction);
            const initializeComputationAction = initializeComputation(electionType, votes, metrics, parameters);
            dispatch(initializeComputationAction);
        }
    },
});

export const ConnectedLayout = connect(
    null,
    mapDispatchToProps
)(Layout as any);
