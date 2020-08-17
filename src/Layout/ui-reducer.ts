import { GlobalActionType } from "../reducers/global-actions";
import { UiState, defaultState } from "./ui-state";
import { UiAction, UiActionType } from "./ui-actions";
import { FullNotificationData } from "./Notifications";

export function ui(state: UiState = defaultState, action: UiAction): UiState {
    switch (action.type) {
        case UiActionType.TOGGLE_HAMBURGER_EXPANDED: {
            return {
                ...state,
                hamburgerExpanded: action.hamburgerExpanded,
            };
        }
        case UiActionType.HIDE_TUTORIAL: {
            return {
                ...state,
                showTutorial: false,
            };
        }
        case UiActionType.ADD_NOTIFICATION: {
            const newNotificationId = state.notificationId + 1;
            const fullNotificationData: FullNotificationData = {
                id: newNotificationId,
                text: action.notification.text,
                type: action.notification.type,
            };

            const copiedNotifications = [...state.notifications];
            copiedNotifications.push(fullNotificationData);
            return {
                ...state,
                notifications: copiedNotifications,
                notificationId: newNotificationId,
            };
        }
        case UiActionType.REMOVE_NOTIFICATION: {
            const filteredNotifications = state.notifications.filter((notification) => notification.id !== action.id);
            return {
                ...state,
                notifications: filteredNotifications,
            };
        }
        case GlobalActionType.CLEAR_STATE: {
            return defaultState;
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
