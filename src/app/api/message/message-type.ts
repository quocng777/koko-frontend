import { UserContact } from "../user/user-type"

export type Message = {
    id: number | null,
    sender: number,
    conservation: number,
    type: MessageType,
    message: string,
    attachments: Attachment[]
    createdAt: string,
    tempId?: string,
    hasError?: boolean,
    seenBy?: MessageSeen[],
    deletedAt?: string,
    broadcast?: MessageBroadcast
}

export type Attachment = {
    id?: number
    fileName: string,
    url: string,
    fileType: string,
    keyObject?: string,
    createdAt?: string
}

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FILE = "FILE",
    DELETED = "DELETED",
    BROADCAST = "BROADCAST"
}

export type MessageQuery = {
    conservationId: number,
    beforeMessage?: number,
    keyword?: string
}

export type MessageSendParams = {
    conservation: number,
    message?: string,
    type: MessageType,
    attachments?: Attachment[] 
}

export type MessageBroadcast = {
    broadcastType: BroadcastType,
    targetUsers: UserContact[]
}

export enum BroadcastType {
    CREATE =  "CREATE",
    ADD_MEMBER = "ADD_MEMBER",
    JOIN = "JOIN",
    LEAVE = "LEAVE"
}

export type MessageSeen = {
    user: number,
    seenAt: string,
    conservation?: number,
    message?: number,
}