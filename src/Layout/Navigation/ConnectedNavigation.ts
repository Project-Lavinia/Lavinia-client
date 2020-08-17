import { RootState } from "../../reducers";
import { NavigationProps, Navigation } from "./Navigation";
import { connect } from "react-redux";
import { toggleHamburger } from "../ui-actions";

const mapStateToProps = (state: RootState): NavigationProps => {
    return {
        hamburgerExpanded: state.uiState.hamburgerExpanded,
    };
};

const mapDispatchToProps = (dispatch: any): NavigationProps => {
    return {
        toggleHamburger: (hamburgerExpanded: boolean) => {
            dispatch(toggleHamburger(hamburgerExpanded));
        },
    };
};

export const ConnectedNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);
