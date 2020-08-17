import { ClearState } from "../reducers/global-actions";
import { NotificationData } from "./Notifications";

export enum UiActionType {
    TOGGLE_HAMBURGER_EXPANDED = "TOGGLE_HAMBURGER_EXPANDED",
    HIDE_TUTORIAL = "HIDE_TUTORIAL",
    ADD_NOTIFICATION = "ADD_NOTIFICATION",
    REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION",
}

export type UiAction = ToggleHamburger | HideTutorial | AddNotificationAction | RemoveNotificationAction | ClearState;

export interface ToggleHamburger {
    type: UiActionType.TOGGLE_HAMBURGER_EXPANDED;
    hamburgerExpanded: boolean;
}

export function toggleHamburger(hamburgerExpanded: boolean) {
    const action: ToggleHamburger = {
        type: UiActionType.TOGGLE_HAMBURGER_EXPANDED,
        hamburgerExpanded: !hamburgerExpanded,
    };
    return action;
}

export function hideTutorial() {
    const action: HideTutorial  = {
        type: UiActionType.HIDE_TUTORIAL,
    };
    return action;
}

export interface HideTutorial {
    type: UiActionType.HIDE_TUTORIAL;
}

export interface AddNotificationAction {
    type: UiActionType.ADD_NOTIFICATION;
    notification: NotificationData;
}

export function addNotification(notification: NotificationData) {
    const action: AddNotificationAction = {
        type: UiActionType.ADD_NOTIFICATION,
        notification,
    };
    return action;
}

export interface RemoveNotificationAction {
    type: UiActionType.REMOVE_NOTIFICATION;
    id: number;
}

export function removeNotification(id: number) {
    const action: RemoveNotificationAction = {
        type: UiActionType.REMOVE_NOTIFICATION,
        id,
    };
    return action;
}
