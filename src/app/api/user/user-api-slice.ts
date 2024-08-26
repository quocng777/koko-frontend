import { number } from "zod";
import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { User, UserContact } from "./user-type";

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
            })
        }
    ),
});

export const { useGetAuthenticationQuery, useLazyGetAuthenticationQuery, useGetFriendsQuery, useLazyGetFriendsQuery } = userApiSlice;