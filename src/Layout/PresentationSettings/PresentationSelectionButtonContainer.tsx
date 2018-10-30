import { PresentationSelectionButton, PresentationSelectionButtonProps } from "./PresentationSelectionButton";
import { connect } from "react-redux";
import { changePresentation } from "./PresentationActions";

interface PropsFromDispatch {
    onPress: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: PresentationSelectionButtonProps): PropsFromDispatch => ({
    onPress: () => {
        const action = changePresentation(ownProps.presentationSelected);
        dispatch(action);
        console.log(`Action ${action.type} dispatched`);
    }
});

export default connect(
    null,
    mapDispatchToProps
)(PresentationSelectionButton as any);
