import { FullNotificationData } from "./Notifications";

export interface UiState {
    hamburgerExpanded: boolean;
    showTutorial: boolean;
    notifications: FullNotificationData[];
    notificationId: number;
}

export const defaultState: UiState = {
    hamburgerExpanded: false,
    showTutorial: true,
    notifications: [],
    notificationId: 0,
};