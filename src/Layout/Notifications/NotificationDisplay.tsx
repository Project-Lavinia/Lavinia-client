import * as React from "react";
import { Notification } from "./Notification";
import { FullNotificationData } from ".";

export interface NotificationDisplayProps {
    notifications: FullNotificationData[];
    close: (id: number) => void;
}

export class NotificationDisplay extends React.Component<NotificationDisplayProps, {}> {
    public render() {
        return (
            <React.Fragment>
                {this.props.notifications.map((notification) => (
                    <Notification data={notification} close={this.props.close} key={notification.id} />
                ))}
            </React.Fragment>
        );
    }
}
