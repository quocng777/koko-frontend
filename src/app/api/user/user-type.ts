export type User = {
    id: number,
    username: string,
    name: string,
    email: string,
    enabled: boolean,
    gender: number,
    avatar: string,
    birthdate: Date,
    createAt: Date,
    verified: boolean
}

export type UserContact = {
    id: number,
    username: string,
    name: string,
    avatar?: string,
    friendStatus?: FriendStatus
}

export enum FriendStatus {
    FRIEND = "FRIEND",
    SENDED_REQUEST = "SENDED_REQUEST",
    RECEIVED_REQUEST = "RECEIVED_REQUEST",
    STRANGER = "STRANGER",
}

export type UserFriend = {
    relatedUser: UserContact,
    friendStatus: FriendStatus,
    createdAt: string,
}