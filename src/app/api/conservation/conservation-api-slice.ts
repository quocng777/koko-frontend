import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";
import { Conservation, ConservationResponse } from "./conservation-type";

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
        })
    })
});

export const { 
    useGetConservationsQuery, 
    useLazyGetConservationsQuery, 
    useLazyGetConservationQuery 
} = conservationApiSlice;