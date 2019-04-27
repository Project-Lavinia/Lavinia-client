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
        const votesUri =
            "http://lavinia-api-staging.azurewebsites.net/api/v2.0.0/votes/previous?number=3&partyCode=ALL&district=ALL";
        const metricsUri =
            "http://lavinia-api-staging.azurewebsites.net/api/v2.0.0/metrics/previous?number=3&district=ALL";
        const parametersUri = "http://lavinia-api-staging.azurewebsites.net/api/v2.0.0/parameters/previous?number=3";

        const uri = "https://mandater-testing.azurewebsites.net/api/v1.0.0/no/pe?deep=true";
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

            const electionType = await request<ElectionType>(uri, failover);
            const initializeRequestDataAction = initializeRequestedData(electionType);
            const initializeComputationAction = initializeComputation(electionType, votes, metrics, parameters);
            const initializeSettingsAction = initializeComputationMenu(electionType);
            const initializePresentationAction = initializePresentation();
            dispatch(initializeRequestDataAction);
            dispatch(initializeComputationAction);
            dispatch(initializePresentationAction);
            dispatch(initializeSettingsAction);
        }
    },
});

export const ConnectedLayout = connect(
    null,
    mapDispatchToProps
)(Layout as any);
