import { apiSlice } from "../api/api-slice";
import { ApiResponse } from "../api/type";
import { LoginRequest, TokenResponse } from "./type";

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
    useLoginMutation
} = authApiSlice