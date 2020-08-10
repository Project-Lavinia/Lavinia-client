export interface NotificationData {
    type: NotificationType;
    text: string;
}

export interface FullNotificationData extends NotificationData {
    id: number;
}

export enum NotificationType {
    DANGER = "DANGER",
    INFO = "INFO",
    PRIMARY = "PRIMARY",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
}
