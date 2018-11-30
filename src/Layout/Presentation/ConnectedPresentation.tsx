import { RootState } from "../../reducers";
import { Presentation, PresentationProps } from "./Presentation";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState): PresentationProps => {
    console.log("PresentationContainer mapped state to props");
    return {
        results: state.computationState.current,
        currentPresentation: state.presentationMenuState.currentPresentation,
        decimals: state.presentationMenuState.decimalsNumber,
        showPartiesWithoutSeats: state.presentationMenuState.showPartiesWithoutSeats,
        districtSelected: state.presentationMenuState.districtSelected,
        disproportionalityIndex: state.presentationMenuState.disproportionalityIndex,
    };
};

export const ConnectedPresentation = connect(
    mapStateToProps,
    {}
)(Presentation as any);
