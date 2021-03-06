﻿import { LayoutProps, Layout } from "./Layout";
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
        const votesUri = process.env.API_V3 + "votes?partyCode=ALL&district=ALL";
        const metricsUri = process.env.API_V3 + "metrics?district=ALL";
        const parametersUri = process.env.API_V3 + "parameters";
        const yearsUri = process.env.API_V3 + "years";
        const partyMapUri = process.env.API_V3 + "parties";

        if (stateIsInvalid()) {
            let votes: Votes[] = [];
            let metrics: Metrics[] = [];
            let rawParameters: RawParameters[] = [];
            let partyMap: _.Dictionary<string> = {};
            let numberYears: number[] = [];

            try {
                votes = await request<Array<Votes>>(votesUri);
                metrics = await request<Array<Metrics>>(metricsUri);
                rawParameters = await request<Array<RawParameters>>(parametersUri);
                partyMap = await request<_.Dictionary<string>>(partyMapUri);
                numberYears = await request<Array<number>>(yearsUri);
            } catch (error) {
                toast({
                    dismissible: true,
                    duration: 5000,
                    message: `Klarte ikke å laste ned valgdata fra APIet, prøv igjen senere. Feilmeldingen var: ${error.message}`,
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
