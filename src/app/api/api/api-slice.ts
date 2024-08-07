import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react"
import { ApiResponse } from "./type";
import { TokenResponse } from "../auth/type";
import { logOut } from "../auth/auth-slice";


const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if(token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    } 
})

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 403) {
        const refreshToken = localStorage.getItem("refreshToken");

        if(refreshToken) {
            try {
                const refreshResult = await baseQuery('/auth/refreshToken', api, {body: {refreshToken}, method: 'POST'}) as ApiResponse<TokenResponse>;
                if(refreshResult.data) {
                    console.log(refreshResult.data);
                    localStorage.setItem("refreshToken", refreshResult.data.refreshToken);
                    localStorage.setItem("accessToken", refreshResult.data.accessToken);
                }
            } catch(e) {
                api.dispatch(logOut());
            }
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }

        return result;
    }


    return result;

}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({})
}
)