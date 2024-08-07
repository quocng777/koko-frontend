import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";
import { LoginRequest, TokenResponse } from "./auth-type";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<ApiResponse<TokenResponse>,LoginRequest>({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        })
    })
})

export const {
    useLoginMutation,
} = authApiSlice