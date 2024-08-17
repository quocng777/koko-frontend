import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { Message, MessageQuery, MessageSendParams } from "./message-type";


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
        })
    })
});

export const { useLazyGetLatestMessageQuery, useLazyGetMessagesQuery, useSendMessageMutation } = messageApi;