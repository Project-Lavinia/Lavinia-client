import { LayoutProps, Layout } from "./Layout";
import { connect } from "react-redux";
import { request } from "../utilities/api-requests";
import { ElectionType, Votes, Metrics, RawParameters, Parameters } from "../requested-data/requested-data-models";
import {
    initializeRequestedData,
    initializeRequestedVotes,
    initializeRequestedMetrics,
    InitializeRequestedParameters,
    initializeRequestedPartyMap,
} from "../requested-data";
import { initializeComputation } from "../computation";
import { initializeComputationMenu } from "./ComputationMenu";
import { initializePresentation } from "./PresentationMenu";
import { stateIsInvalid } from "../store/version";
import { rawParametersToParametersConverter } from "../requested-data/requested-data-utilities";
import { RootState } from "../reducers";
import { Dictionary } from "utilities/dictionary";
import { toggleHamburger } from "./ui-reducer";

const mapStateToProps = (state: RootState): Pick<LayoutProps, "dataLoaded" | "hamburgerExpanded"> => ({
    dataLoaded: state.requestedDataState.dataLoaded,
    hamburgerExpanded: state.uiState.hamburgerExpanded,
});

const mapDispatchToProps = (dispatch: any): Pick<LayoutProps, "initializeState" | "toggleHamburger"> => ({
    initializeState: async () => {
        const defaultUri = process.env.API_V1 + "no/pe?deep=true";

        const votesUri = process.env.API_V3 + "votes?partyCode=ALL&district=ALL";
        const metricsUri = process.env.API_V3 + "metrics?district=ALL";
        const parametersUri = process.env.API_V3 + "parameters";
        const partyMapUri = process.env.API_V3 + "parties";

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

            const partyMap = await request<Dictionary<string>>(partyMapUri, {});
            const initializeRequestedPartyMapAction = initializeRequestedPartyMap(partyMap);
            dispatch(initializeRequestedPartyMapAction);

            const electionType = await request<ElectionType>(defaultUri, failover);
            const initializeRequestDataAction = initializeRequestedData(electionType);
            dispatch(initializeRequestDataAction);

            const initializeSettingsAction = initializeComputationMenu(electionType, parameters[0]);
            dispatch(initializeSettingsAction);

            const initializePresentationAction = initializePresentation();
            dispatch(initializePresentationAction);
            
            const initializeComputationAction = initializeComputation(electionType, votes, metrics, parameters);
            dispatch(initializeComputationAction);
        }
    },
    toggleHamburger: (hamburgerExpanded: boolean) => {
        dispatch(toggleHamburger(hamburgerExpanded));
    },
});

export const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(Layout as any);
