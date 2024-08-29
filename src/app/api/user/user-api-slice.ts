import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { User, UserContact, UserFriend } from "./user-type";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAuthentication: builder.query<ApiResponse<User>, void>({
                query: () => ({
                    url: '/users/me',
                    method: 'GET'
                })
            }),
            getFriends: builder.query<ApiResponse<ApiPaging<UserContact>>, {pageSize: number, pageNum: number, keyword?: string}>({
                query: (params) => ({
                    params,
                    url: '/users/friends',
                    method: 'GET',
                })
            }),
            checkFriendStatus: builder.query<ApiResponse<UserContact>, number>({
                query: (params) => {
                    return {
                        url: '/users/friend-status',
                        params: {friendId: params},
                        method: 'GET',
                    }
                }
            }),
            requestFriend: builder
            .query<ApiResponse<UserContact>, number>({
                query: (friendId) => ({
                    url: '/users/friends/request',
                    params: {
                        friendId,
                    },
                    method: 'GET'
                })
            }),
            getReceivedFriendRequests: builder.query<ApiResponse<ApiPaging<UserFriend>>, {pageSize: number, pageNum: number}>({
                query: (params) => ({
                    url: '/users/friends/received-requests',
                    params,
                    method: 'GET'
                })
            }),
            acceptFriendRequest: builder.query<ApiResponse<UserFriend>, number>({
                query: (friendId) => ({
                    url: '/users/friends/accept',
                    params: {
                        friendId,
                    },
                    method: 'GET'
                }) 
            })
        }
    ),
});

export const { 
    useGetAuthenticationQuery, 
    useLazyGetAuthenticationQuery, 
    useGetFriendsQuery, 
    useLazyGetFriendsQuery, 
    useCheckFriendStatusQuery, 
    useLazyCheckFriendStatusQuery,
    useLazyRequestFriendQuery,
    useGetReceivedFriendRequestsQuery,
    useLazyAcceptFriendRequestQuery
 } = userApiSlice;