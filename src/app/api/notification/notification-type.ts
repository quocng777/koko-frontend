import { UserContact } from "../user/user-type";

export type Notification = {
    id: number,
    publishedUser: UserContact,
    recipient: number,
    objectUrl: string,
    objectId: number,
    seenAt?: string,
    dismissedAt?: string,
    createdAt: string,
    type: NotificationType
}

export enum NotificationType {
    FRIEND_REQUEST = "FRIEND_REQUEST",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
}

export type NotificationQuery = {
    pageNum: number,
    pageSize: number,
    beforeId?: number
}