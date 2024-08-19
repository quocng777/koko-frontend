export type Message = {
    id: number | null,
    sender: number,
    conservation: number,
    type: MessageType,
    message: string,
    attachments: Attachment[]
    createdAt: string,
    seenAt?: string,
    tempId?: string,
    hasError?: boolean,
}

export type Attachment = {
    id?: number
    fileName: string,
    url: string,
    createdAt?: string
}

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FILE = "FILE"
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