import { RootState } from "../../reducers";
import { PresentationComponent, PresentationProps } from "./PresentationComponent";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState): PresentationProps => {
    console.log("PresentationContainer mapped state to props");
    return {
        results: state.computationState.results,
        currentPresentation: state.presentationState.currentPresentation,
        decimals: state.presentationState.decimalsNumber,
        showPartiesWithoutSeats: state.presentationState.showPartiesWithoutSeats,
        districtSelected: state.presentationState.districtSelected
    };
};

export const PresentationContainer = connect(
    mapStateToProps,
    {}
)(PresentationComponent as any);
