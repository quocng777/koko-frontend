import { Api } from "@reduxjs/toolkit/query";
import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { Message, MessageQuery, MessageSeen, MessageSendParams } from "./message-type";


const messageApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLatestMessage: builder.query<ApiResponse<Message>, {conservation: number}>({
            query: (params) => ({
                url: "/messages/latest",
                params: params,
                method: 'GET'
            })
        }),
        getMessages: builder.query<ApiResponse<ApiPaging<Message>>, MessageQuery & {
            pageNum: number, 
            pageSize: number}>({
                query: (params) => ({
                    url: '/messages',
                    params: params,
                    method: 'GET'
                })
            }),
        sendMessage: builder.mutation<ApiResponse<Message>, MessageSendParams>({
            query: (rq) => ({
                url: '/messages',
                body: rq,
                method: 'POST'
            })
        }),
        updateSeenStatus: builder.query<ApiResponse<MessageSeen[]>, {conservation: number}>({
            query: (params) => ({
                url: '/messages/seen-status',
                params: params,
                method: 'GET'
            })
        }),
        getNumUnreadMsg: builder.query<ApiResponse<number>, { conservation: number }>({
            query: (params) => ({
                url: '/messages/unseen',
                params,
                method: 'GET'
            })
        }),
        unSendMessage: builder.mutation<ApiResponse<Message>, number>({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE'
            })
        })
    })
});

export const { useLazyGetLatestMessageQuery, useLazyGetMessagesQuery, useSendMessageMutation, useLazyUpdateSeenStatusQuery, useLazyGetNumUnreadMsgQuery, useUnSendMessageMutation } = messageApi;