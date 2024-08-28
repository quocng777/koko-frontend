import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { Notification, NotificationQuery } from "./notification-type";

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNumNotification: builder.query<ApiResponse<number>, void>({
            query: () => ({
                url: '/notifications/undismissed',
                method: 'GET'
            })
        }),
        getNotifications: builder.query<ApiResponse<ApiPaging<Notification>>, NotificationQuery>({
            query: (params) => ({
                url: '/notifications',
                method: 'GET',
                params
            })
        })
    })
});

export const { 
    useGetNumNotificationQuery,
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery
 } = notificationApiSlice;