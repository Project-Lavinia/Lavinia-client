import { RootState } from "../../reducers";
import { TutorialProps, Tutorial } from "./Tutorial";
import { connect } from "react-redux";
import { hideTutorial } from "../ui-reducer";

const mapStateToProps = (state: RootState): Pick<TutorialProps, "showTutorial"> => ({
    showTutorial: state.uiState.showTutorial,
});

const mapDispatchToProps = (dispatch: any): Pick<TutorialProps, "closeTutorial"> => ({
    closeTutorial: () => {
        const hideTutorialAction = hideTutorial();
        dispatch(hideTutorialAction);
    },
});

export const ConnectedTutorial = connect(mapStateToProps, mapDispatchToProps)(Tutorial as any);
