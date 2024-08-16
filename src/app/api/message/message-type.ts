export type Message = {
    id: number,
    conservation: number,
    type: MessageType,
    message: string,
    attachments: Attachment[]
    createdAt: Date
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
