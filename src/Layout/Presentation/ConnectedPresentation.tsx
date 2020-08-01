import { RootState } from "../../reducers";
import { Presentation, PresentationProps } from "./Presentation";
import { connect } from "react-redux";
import { selectDistrict } from "../PresentationMenu";

const mapStateToProps = (state: RootState): Partial<PresentationProps> => {
    const year = parseInt(state.settingsState.year);
    return {
        comparisonPartyResults: state.computationState.comparison.partyResults,
        results: state.computationState.current,
        currentPresentation: state.presentationMenuState.currentPresentation,
        decimals: state.presentationMenuState.decimalsNumber,
        showPartiesWithoutSeats: state.presentationMenuState.showPartiesWithoutSeats,
        districtSelected: state.presentationMenuState.districtSelected,
        disproportionalityIndex: state.presentationMenuState.disproportionalityIndex,
        showComparison: state.presentationMenuState.showComparison,
        year,
        algorithm: state.computationState.algorithm,
        threshold: state.computationState.electionThreshold,
        showFilters: state.presentationMenuState.showFilters,
        partyMap: state.requestedDataState.partyMap,
    } as PresentationProps;
};

const mapDispatchToProps = (dispatch: any): Partial<PresentationProps> => ({
    selectDistrict: (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(selectDistrict(event.target.value));
    },
});

export const ConnectedPresentation = connect(
    mapStateToProps,
    mapDispatchToProps
)(Presentation as any);
