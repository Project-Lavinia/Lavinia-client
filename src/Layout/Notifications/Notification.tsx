import * as React from "react";
import { checkExhaustively } from "../../utilities";
import { FullNotificationData, NotificationType } from "./notification-models";

export interface NotificationProps {
    data: FullNotificationData;
    close: (id: number) => void;
}

function buildClassText(type: NotificationType): string {
    const baseClass = "notification ";
    switch (type) {
        case NotificationType.DANGER:
            return baseClass + "is-danger";
        case NotificationType.INFO:
            return baseClass + "is-info";
        case NotificationType.PRIMARY:
            return baseClass + "is-primary";
        case NotificationType.SUCCESS:
            return baseClass + "is-success";
        case NotificationType.WARNING:
            return baseClass + "is-warning";
        default:
            checkExhaustively(type);
            throw Error("Reached unreachable code!");
    }
}

export class Notification extends React.Component<NotificationProps, {}> {
    constructor(props: NotificationProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.close(this.props.data.id);
    }

    public render() {
        return (
            <div className={buildClassText(this.props.data.type)}>
                <button className="delete" onClick={this.handleClose} />
                {this.props.data.text}
            </div>
        );
    }
}
