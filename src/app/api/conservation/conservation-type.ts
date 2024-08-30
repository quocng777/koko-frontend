import { Message } from "../message/message-type"

export type ConservationResponse = {
    id: number,
    avatar?: string,
    name?: string,
    participants: Participant[],
    type: ConservationType
    createdAt: Date 
}

export type Conservation = ConservationResponse & {
    lastMessage?: Message,
    unread?: number,
}

export type Participant = {
    userId: number,
    userAvatar?: string,
    username: string,
    name: string,
    createdAt: Date,
}

export enum ConservationType  {
    SINGLE = "SINGLE",
    GROUP = "GROUP",
}


export type ConservationParams = {
    name: string,
    type: ConservationType,
    participants: number[]
}