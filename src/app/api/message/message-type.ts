export type Message = {
    id: number | null,
    sender: number,
    conservation: number,
    type: MessageType,
    message: string,
    attachments: Attachment[]
    createdAt: string
    tempId?: string,
    hasError?: boolean,
}

export type Attachment = {
    id: number,
    url: string,
    createdAt: Date
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