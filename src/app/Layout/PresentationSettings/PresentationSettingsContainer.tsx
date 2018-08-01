import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { PresentationSettings } from "./PresentationSettings";
import { ChangeDecimalsAction, selectDistrict, ChangeShowPartiesNoSeat } from "./PresentationActions";
import { PresentationAction } from "../Types/ActionTypes";
import { PresentationType } from "../Types";
import { LagueDhontResult } from "../Interfaces/Results";

interface PropsFromState {
    currentPresentation: PresentationType;
    decimals: string;
    results: LagueDhontResult;
    showPartiesWithoutSeats: boolean;
    districtSelected: string;
}

interface PropsFromDispatch {
    changeDecimals: (decimals: string, decimalsNumber: number) => void;
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function mapStateToProps(state: RootState): PropsFromState {
    return {
        currentPresentation: state.presentationState.currentPresentation,
        decimals: state.presentationState.decimals,
        results: state.computationState.results,
        showPartiesWithoutSeats: state.presentationState.showPartiesWithoutSeats,
        districtSelected: state.presentationState.districtSelected
    };
}

const mapDispatchToProps = (dispatch: any): PropsFromDispatch => ({
    changeDecimals: (decimals: string, decimalsNumber: number) => {
        const action: ChangeDecimalsAction = {
            type: PresentationAction.ChangeDecimals,
            decimals,
            decimalsNumber
        };
        dispatch(action);
    },
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => {
        const action: ChangeShowPartiesNoSeat = {
            type: PresentationAction.ShowPartiesNoSeats,
            showPartiesWithoutSeats: event.target.checked
        };
        dispatch(action);
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
