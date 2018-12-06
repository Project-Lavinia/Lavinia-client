import { LayoutProps, Layout } from "./Layout";
import { connect } from "react-redux";
import { request } from "../utilities/api-requests";
import { ElectionType } from "../requested-data/requested-data-models";
import { initializeRequestedData } from "../requested-data";
import { initializeComputation } from "../computation";
import { initializeComputationMenu } from "./ComputationMenu";
import { initializePresentation } from "./PresentationMenu";

const mapDispatchToProps = (dispatch: any): LayoutProps => ({
    initializeState: async () => {
        const uri = "https://mandater-testing.azurewebsites.net/api/v1.0.0/no/pe?deep=true";
        const failover: ElectionType = {
            internationalName: "UNDEFINED",
            electionTypeId: -1,
            countryId: -1,
            elections: [],
        };
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            const electionType = await request<ElectionType>(uri, failover);
            const initializeRequestDataAction = initializeRequestedData(electionType);
            const initializeComputationAction = initializeComputation(electionType);
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
