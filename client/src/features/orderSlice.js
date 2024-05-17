import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BACKEND_API from "../components/api";

const initialState = {
    list: [],
    status: ''
}

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async({token}) => {
        try {
        const res = await axios.get(`${BACKEND_API}/order/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
            return res?.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const editOrder = createAsyncThunk(
    'orders/editOrder',
    async (data, { getState }) => {
        const state = getState()
        try {
            const order = state.orders.list.filter(order => order._id === data.id)
            const res = await axios.put(`${BACKEND_API}/order/${data.id}`, { ...order, delivery_status: data.action },{
          headers: {
            Authorization: `Bearer ${data.token}`
          }
            })
            return res?.data

        } catch (error) {
            console.log(error)
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchOrders.pending, (state, action) => {
            state.status = 'pending'
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.list = action.payload
                state.status = 'success'
            })
            .addCase(fetchOrders.rejected, (state, action) => {
            state.status = 'rejected'
            })
            .addCase(editOrder.pending, (state, action) => {
            state.status = 'pending'
            })
            .addCase(editOrder.fulfilled, (state, action) => {
                state.list.map(order => order._id === action.payload._id ? action.payload : order)
                state.status = 'success'
            })
            .addCase(editOrder.rejected, (state, action) => {
            state.status = 'rejected'
            })
    }
})

export default orderSlice.reducer