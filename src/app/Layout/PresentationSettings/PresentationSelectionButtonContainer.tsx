import { PresentationSelectionButton, PresentationSelectionButtonProps } from "./PresentationSelectionButton";
import { connect } from "react-redux";
import { changePresentation } from "./PresentationActions";

const mapDispatchToProps = (dispatch: any, ownProps: PresentationSelectionButtonProps) => ({
    onPress: () => {
        const props: PresentationSelectionButtonProps = ownProps;
        const action = changePresentation(props.presentationSelected);
        dispatch(action);
        console.log(`Action ${action.type} dispatched`);
    }
});

export default connect(
    null,
    mapDispatchToProps
)(PresentationSelectionButton as any);
