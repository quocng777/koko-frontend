import { apiSlice } from "../base/api-slice";
import { ApiResponse } from "../base/type";
import { ConservationResponse } from "./conservation-type";

export const conservationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConservations: builder.query<ApiResponse<ConservationResponse[]>, void>({
            query: () => ({
                url: '/conservations',
                method: 'GET'
            })
        })
    })
});

export const { useGetConservationsQuery, useLazyGetConservationsQuery } = conservationApiSlice;