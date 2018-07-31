import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { PresentationSettings } from "./PresentationSettings";
import { ChangeDecimalsAction, selectDistrict } from "./PresentationActions";
import { PresentationAction } from "../Types/ActionTypes";

function mapStateToProps(state: RootState) {
    return {
        currentPresentation: state.presentationState.currentPresentation,
        decimals: state.presentationState.decimals,
        results: state.computationState.results,
        showPartiesWithoutSeats: state.presentationState.showPartiesWithoutSeats,
        districtSelected: state.presentationState.districtSelected
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    changeDecimals: (decimals: string, decimalsNumber: number) => {
        dispatch({
            type: PresentationAction.ChangeDecimals,
            decimals,
            decimalsNumber
        } as ChangeDecimalsAction);
    },
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: PresentationAction.ShowPartiesNoSeats,
            showPartiesWithoutSeats: event.target.checked
        });
    },
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => {
        const action = selectDistrict(event.target.value);
        dispatch(action);
    }
});

const presentationSettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PresentationSettings as any);

export default presentationSettingsContainer;
