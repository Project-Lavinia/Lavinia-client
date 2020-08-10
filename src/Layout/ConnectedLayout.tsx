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
import { NotificationType, NotificationData } from "./Notifications";
import { addNotification } from "./ui-actions";

const mapStateToProps = (state: RootState): Pick<LayoutProps, "dataLoaded"> => ({
    dataLoaded: state.requestedDataState.dataLoaded,
});

const mapDispatchToProps = (
    dispatch: any
): Pick<LayoutProps, "initializeState" | "clearState" | "showNotification"> => ({
    initializeState: async () => {
        const votesUri = process.env.API_V3 + "votes?partyCode=ALL&district=ALL";
        const metricsUri = process.env.API_V3 + "metrics?district=ALL";
        const parametersUri = process.env.API_V3 + "parameters";
        const yearsUri = process.env.API_V3 + "years";
        const partyMapUri = process.env.API_V3 + "parties";

        if (stateIsInvalid()) {
            const votes = await request<Array<Votes>>(votesUri, []);
            const initializeRequestedVotesAction = initializeRequestedVotes(votes);
            dispatch(initializeRequestedVotesAction);

            const metrics = await request<Array<Metrics>>(metricsUri, []);
            const initializeRequestedMetricsAction = initializeRequestedMetrics(metrics);
            dispatch(initializeRequestedMetricsAction);

            const rawParameters = await request<Array<RawParameters>>(parametersUri, []);
            const parameters = rawParameters.map<Parameters>((raw) => rawParametersToParametersConverter(raw));
            const initializeRequestedParametersAction = initializeRequestedParameters(parameters);
            dispatch(initializeRequestedParametersAction);

            const partyMap = await request<_.Dictionary<string>>(partyMapUri, {});
            const initializeRequestedPartyMapAction = initializeRequestedPartyMap(partyMap);
            dispatch(initializeRequestedPartyMapAction);

            const numberYears = await request<Array<number>>(yearsUri, []);
            const electionYear = numberYears[0];
            const stringYears = numberYears.map((year) => year.toString());

            const initializeSettingsAction = initializeComputationMenu(stringYears, parameters[0]);
            const initializePresentationAction = initializePresentation();
            dispatch(initializePresentationAction);
            dispatch(initializeSettingsAction);
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

    showNotification: (type: NotificationType, text: string) => {
        const notification: NotificationData = {
            text,
            type,
        };
        const addNotificationAction = addNotification(notification);
        dispatch(addNotificationAction);
    },
});

export const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(Layout as any);
