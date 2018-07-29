import { LayoutComponent } from "./LayoutComponent";
import { connect } from "react-redux";
import { initializeComputation } from "./Computation";
import { initializePresentation } from "./PresentationSettings";
import { initializeRequestedData, request } from "./API";
import { initializeSettings } from "./ComputationSettings";
import { ElectionType } from "./Interfaces/Models";

const mapDispatchToProps = (dispatch: any) => ({
    initializeState: async () => {
        const uri = "https://lavinia-api-staging.azurewebsites.net/api/v1.0.0/no/pe?deep=true";
        const failover: ElectionType = {
            internationalName: "UNDEFINED",
            electionTypeId: -1,
            countryId: -1,
            elections: []
        };
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            const electionType = await request<ElectionType>(uri, failover);
            const initializeRequestDataAction = initializeRequestedData(electionType);
            const initializeComputationAction = initializeComputation(electionType);
            const initializeSettingsAction = initializeSettings(electionType);
            const initializePresentationAction = initializePresentation();
            dispatch(initializeRequestDataAction);
            console.log(`Action of type ${initializeRequestDataAction.type} dispatched`);
            dispatch(initializeComputationAction);
            console.log(`Action of type ${initializeComputationAction.type} dispatched`);
            dispatch(initializePresentationAction);
            console.log(`Action of type ${initializePresentationAction.type} dispatched`);
            dispatch(initializeSettingsAction);
            console.log(`Action of type ${initializeSettingsAction.type} dispatched`);
        }
    }
});

export const Layout = connect(
    null,
    mapDispatchToProps
)(LayoutComponent as any);
