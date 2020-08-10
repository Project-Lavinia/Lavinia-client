import { FullNotificationData } from "./Notifications";

export interface UiState {
    hamburgerExpanded: boolean;
    notifications: FullNotificationData[];
    notificationId: number;
}

export const defaultState: UiState = {
    hamburgerExpanded: false,
    notifications: [],
    notificationId: 0,
};
