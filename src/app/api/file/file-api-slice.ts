import { PresignedUrl } from "../../../hook/upload-media";
import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";

const fileApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPreSignedUrl: builder.query<ApiResponse<PresignedUrl>, void>({
            query: () => ({
                url: '/files/preSignedUrl',
                method: 'GET'
            })
        })
    })
});

export const { useLazyGetPreSignedUrlQuery } = fileApi;