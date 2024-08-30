import { apiSlice } from "../base/api-slice";
import { ApiPaging, ApiResponse } from "../base/type";
import { Conservation, ConservationParams, ConservationResponse } from "./conservation-type";

export type ConservationQueryParams = {
    pageSize: number,
    pageNum: number,
    keyword?: string
}

export const conservationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConservations: builder.query<ApiResponse<ConservationResponse[]>, void>({
            query: () => ({
                url: '/conservations',
                method: 'GET'
            })
        }),
        getConservation: builder.query<ApiResponse<Conservation>, number>({
            query: (consId) => ({
                url: `/conservations/${consId}`,
                method: 'GET'
            })
        }),
        getConservationsPaging: builder.query<ApiResponse<ApiPaging<Conservation>>, ConservationQueryParams>({
            query: (params) => ({
                url: '/conservations/paging',
                params,
                method: "GET"
            })
        }),
        createConservation: builder.mutation<ApiResponse<Conservation>, ConservationParams>({
            query: (body) => ({
                url: '/conservations',
                body,
                method: "POST"
            })
        })
    })
});

export const { 
    useGetConservationsQuery, 
    useLazyGetConservationsQuery, 
    useLazyGetConservationQuery,
    useLazyGetConservationsPagingQuery,
    useCreateConservationMutation 
} = conservationApiSlice;