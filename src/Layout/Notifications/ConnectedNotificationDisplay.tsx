import { connect } from "react-redux";
import { NotificationDisplay, NotificationDisplayProps } from "./NotificationDisplay";
import { removeNotification } from "../ui-actions";
import { RootState } from "../../reducers";

const mapStateToProps = (state: RootState): Pick<NotificationDisplayProps, "notifications"> => ({
    notifications: state.uiState.notifications,
});

const mapDispatchToProps = (dispatch: any): Pick<NotificationDisplayProps, "close"> => ({
    close: (id: number) => {
        const closeNotificationAction = removeNotification(id);
        dispatch(closeNotificationAction);
    },
});

export const ConnectedNotificationDisplay = connect(mapStateToProps, mapDispatchToProps)(NotificationDisplay as any);
