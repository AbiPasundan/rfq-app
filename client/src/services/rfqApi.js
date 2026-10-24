import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rfqApi = createApi({
    reducerPath: 'rfqApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
    tagTypes: ['Customer', 'RFQ'],
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: () => 'customers',
            providesTags: ['Customer'],
        }),
        getRfqs: builder.query({
            query: () => 'rfqs',
            providesTags: ['RFQ'],
        }),
        getRfqById: builder.query({
            query: (id) => `rfqs/${id}`,
            providesTags: (result, error, id) => [{ type: 'RFQ', id }],
        }),

        createCustomer: builder.mutation({
            query: (newCustomer) => ({
                url: 'customers',
                method: 'POST',
                body: newCustomer,
            }),
            invalidatesTags: ['Customer'],
        }),
        createRfq: builder.mutation({
            query: (newRfq) => ({
                url: 'rfqs',
                method: 'POST',
                body: newRfq,
            }),
            invalidatesTags: ['RFQ'],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetRfqsQuery,
    useGetRfqByIdQuery,
    useCreateCustomerMutation,
    useCreateRfqMutation,
} = rfqApi;