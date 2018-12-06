import { PresentationSelectionButton, PresentationSelectionButtonProps } from "./PresentationSelectionButton";
import { connect } from "react-redux";
import { changePresentation } from "../../presentation-menu-actions";

interface DispatchProps {
    onPress: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: PresentationSelectionButtonProps): DispatchProps => ({
    onPress: () => {
        const action = changePresentation(ownProps.presentationSelected);
        dispatch(action);
    },
});

export const ConnectedPresentationSelectionButton = connect(
    null,
    mapDispatchToProps
)(PresentationSelectionButton as any);
