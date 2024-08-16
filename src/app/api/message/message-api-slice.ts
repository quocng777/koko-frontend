import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";
import { Message } from "./message-type";

const messageApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLatestMessage: builder.query<ApiResponse<Message>, {conservation: number}>({
            query: (params) => ({
                url: "/messages/latest",
                params: params,
                method: 'GET'
            })
        })
    })
});

export const { useLazyGetLatestMessageQuery } = messageApi;