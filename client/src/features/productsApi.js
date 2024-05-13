import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/product' }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: (params) => ({
                url: '/',
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })
        }),
        getProduct: builder.query({
            query: (params) => ({
                url: `/${params.id}/`,
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })
        })
    })
})

export const { useGetAllProductsQuery, useGetProductQuery } = productsApi;