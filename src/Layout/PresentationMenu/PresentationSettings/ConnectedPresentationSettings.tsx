import { RootState } from "../../../reducers";
import { connect } from "react-redux";
import { PresentationSettingsMenu, PresentationSettingsProps } from "./PresentationSettings";
import {
    ChangeDecimalsAction,
    selectDistrict,
    ChangeShowPartiesNoSeats,
    PresentationMenuAction,
    ChangeDisproportionalityIndexAction
} from "../presentation-menu-actions";
import { DisproportionalityIndex } from "../../Presentation/presentation-models";

function mapStateToProps(state: RootState): Partial<PresentationSettingsProps> {
    return {
        currentPresentation: state.presentationMenuState.currentPresentation,
        decimals: state.presentationMenuState.decimals,
        results: state.computationState.results,
        showPartiesWithoutSeats: state.presentationMenuState.showPartiesWithoutSeats,
        districtSelected: state.presentationMenuState.districtSelected,
        disproportionalityIndex: state.presentationMenuState.disproportionalityIndex
    };
}

const mapDispatchToProps = (dispatch: any): Partial<PresentationSettingsProps> => ({
    changeDecimals: (decimals: string, decimalsNumber: number) => {
        const action: ChangeDecimalsAction = {
            type: PresentationMenuAction.ChangeDecimals,
            decimals,
            decimalsNumber
        };
        dispatch(action);
    },
    toggleShowPartiesWithoutSeats: (event: React.ChangeEvent<HTMLInputElement>) => {
        const action: ChangeShowPartiesNoSeats = {
            type: PresentationMenuAction.ShowPartiesNoSeats,
            showPartiesWithoutSeats: event.target.checked
        };
        dispatch(action);
    },
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => {
        const action = selectDistrict(event.target.value);
        dispatch(action);
    },
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("test");

        const action: ChangeDisproportionalityIndexAction = {
            type: PresentationMenuAction.ChangeDisproportionalityIndex,
            index: event.target.value as DisproportionalityIndex
        };
        dispatch(action);
    }
});

const presentationSettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PresentationSettingsMenu as any);

export default presentationSettingsContainer;
