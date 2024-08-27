import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNumNotification: builder.query<ApiResponse<number>, void>({
            query: () => ({
                url: '/notifications/undismissed',
                method: 'GET'
            })
        })
    })
});

export const { useGetNumNotificationQuery } = notificationApiSlice;