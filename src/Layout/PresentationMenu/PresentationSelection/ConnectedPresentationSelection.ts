import { RootState } from "../../../reducers";
import { PresentationSelectionProps, PresentationSelection } from "./PresentationSelection";
import { changePresentation } from "../presentation-menu-actions";
import { PresentationType } from "../../Presentation/presentation-models";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState): Partial<PresentationSelectionProps> => ({
    currentSelection: state.presentationMenuState.currentPresentation,
});

const mapDispatchToProps = (dispatch: any): Partial<PresentationSelectionProps> => ({
    changeSelection: (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(changePresentation(event.target.value as PresentationType));
    },
});

export const ConnectedPresentationSelection = connect(
    mapStateToProps,
    mapDispatchToProps
)(PresentationSelection);
