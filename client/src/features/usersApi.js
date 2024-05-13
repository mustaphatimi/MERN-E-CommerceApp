import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: 'auth/register',
                method: 'POST',
                body,
                headers: {
                'Content-Type': 'application/json'
            }
            })
        }),
        login: builder.mutation({
            query: (body) => ({
                url: 'auth/login',
                method: 'POST',
                body,
                headers: {
                'Content-Type': 'application/json'
            }
            })
        }),
        logout: builder.mutation({
            query: ()=> '/auth/logout'
        })
    }) 
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = usersApi;