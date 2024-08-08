import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";
import { User } from "./user-type";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAuthentication: builder.query<ApiResponse<User>, void>({
                query: () => ({
                    url: '/users/me',
                    method: 'GET'
                })
            })
        }
    ),
});

export const { useGetAuthenticationQuery, useLazyGetAuthenticationQuery } = userApiSlice;