import { LayoutProps, Layout } from "./Layout";
import { connect } from "react-redux";
import { request } from "../utilities/api-requests";
import { Votes, Metrics, RawParameters, Parameters } from "../requested-data/requested-data-models";
import {
    initializeRequestedVotes,
    initializeRequestedMetrics,
    initializeRequestedParameters,
    initializeRequestedPartyMap,
} from "../requested-data";
import { initializeComputation } from "../computation";
import { initializeComputationMenu } from "./ComputationMenu";
import { initializePresentation } from "./PresentationMenu";
import { stateIsInvalid } from "../store/version";
import { rawParametersToParametersConverter } from "../requested-data/requested-data-utilities";
import { RootState } from "../reducers";
import { clearState } from "../reducers/global-actions";
import { toggleHamburger } from "./ui-actions";
import { toast } from "bulma-toast";

const mapStateToProps = (state: RootState): Pick<LayoutProps, "dataLoaded" | "hamburgerExpanded"> => ({
    dataLoaded: state.requestedDataState.dataLoaded,
    hamburgerExpanded: state.uiState.hamburgerExpanded,
});

const mapDispatchToProps = (
    dispatch: any
): Pick<LayoutProps, "initializeState" | "toggleHamburger" | "clearState"> => ({
    initializeState: async () => {
        const votesUri = "/assets/election-data/votes.json";
        const metricsUri = "/assets/election-data/metrics.json";
        const parametersUri = "/assets/election-data/parameters.json";
        const yearsUri = "/assets/election-data/years.json";
        const partyMapUri = "/assets/election-data/parties.json";

        if (stateIsInvalid(process.env.APP_VERSION, process.env.DATA_VERSION)) {
            let votes: Votes[] = [];
            let metrics: Metrics[] = [];
            let rawParameters: RawParameters[] = [];
            let partyMap: _.Dictionary<string> = {};
            let numberYears: number[] = [];

            try {
                await Promise.all([
                    request<Array<Votes>>(votesUri), // 0
                    request<Array<Metrics>>(metricsUri), // 1
                    request<Array<RawParameters>>(parametersUri), // 2
                    request<_.Dictionary<string>>(partyMapUri), // 3
                    request<Array<number>>(yearsUri), // 4
                ]).then((values) => {
                    votes = values[0];
                    metrics = values[1];
                    rawParameters = values[2];
                    partyMap = values[3];
                    numberYears = values[4];
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                toast({
                    dismissible: true,
                    duration: 5000,
                    message: `Klarte ikke å laste ned valgdata fra APIet, prøv igjen senere. Feilmeldingen var: ${errorMessage}`,
                    position: "top-left",
                    type: "is-danger"
                });
            }

            const initializeRequestedVotesAction = initializeRequestedVotes(votes);
            dispatch(initializeRequestedVotesAction);

            const initializeRequestedMetricsAction = initializeRequestedMetrics(metrics);
            dispatch(initializeRequestedMetricsAction);

            const parameters = rawParameters.map<Parameters>((raw) => rawParametersToParametersConverter(raw));
            const initializeRequestedParametersAction = initializeRequestedParameters(parameters);
            dispatch(initializeRequestedParametersAction);

            const initializeRequestedPartyMapAction = initializeRequestedPartyMap(partyMap);
            dispatch(initializeRequestedPartyMapAction);

            const electionYear = numberYears[0];
            const stringYears = numberYears.map((year) => year.toString());
            const initializeSettingsAction = initializeComputationMenu(stringYears, parameters[0]);
            dispatch(initializeSettingsAction);

            const initializePresentationAction = initializePresentation();
            dispatch(initializePresentationAction);

            const initializeComputationAction = initializeComputation(
                electionYear,
                votes,
                metrics,
                parameters,
                partyMap
            );
            dispatch(initializeComputationAction);
        }
    },

    clearState: () => {
        const clearStateAction = clearState();
        dispatch(clearStateAction);
    },

    toggleHamburger: (hamburgerExpanded: boolean) => {
        dispatch(toggleHamburger(hamburgerExpanded));
    },
});

export const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(Layout as any);
