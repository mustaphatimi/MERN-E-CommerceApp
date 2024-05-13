import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    items: [],
    product: {},
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
    productStatus: null
}

export const productsFetch = createAsyncThunk(
    'product/productsFetch',
    async () => {
        try {
            const res = await axios.get('http://localhost:5000/product')
        return res?.data;
        } catch (error) {
            console.log(error)
        }
       
    }
)

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async ({ data, token }) => {
        try {
            const res = await axios.post('http://localhost:5000/product', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        // console.log(res?.data)
        return res?.data;
        } catch (error) {
            console.log(error)
        }
    }
)

export const editProduct = createAsyncThunk(
    'product/editProduct',
    async ({ id, token, data }) => {
        try {
            const res = await axios.put(`http://localhost:5000/product/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        return res?.data;
        } catch (error) {
            console.log(error)
        }
    }
)

export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({ id, token }) => {
        try {
             const res = await axios.get(`http://localhost:5000/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`    
            }
        })
        return res?.data;
        } catch (error) {
            console.log(error)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async ({ id, token }) => {
        try {
             const res = await axios.delete(`http://localhost:5000/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`    
            }
        })
        return res?.data;
        } catch (error) {
            console.log(error)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(productsFetch.pending, (state, action) => {
            state.status = 'pending'
            })
            .addCase(productsFetch.fulfilled, (state, action) => {
                state.items = action.payload
                state.status = 'success'
            })
            .addCase(productsFetch.rejected, (state, action) => {
                state.status = 'rejected'
            })
            .addCase(getProduct.pending, (state, action) => {
            state.productStatus = 'pending'
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.product = action.payload
                state.productStatus = 'success'
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.productStatus = 'rejected'
            })
            .addCase(createProduct.pending, (state, action) => {
            state.createStatus = 'pending'
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload)
                state.createStatus = 'success'
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createStatus = 'rejected'
            })
            .addCase(editProduct.pending, (state, action) => {
            state.editStatus = 'pending'
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                const update = state.items.map((item) => item._id === action.payload._id ? action.payload : item)
                state.items = update;
                state.editStatus = 'success'
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.editStatus = 'rejected'
            })
            .addCase(deleteProduct.pending, (state, action) => {
            state.deleteStatus = 'pending'
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const newItems = state.items.filter((item) => item._id !== action.payload._id)
                state.items = newItems;
                state.deleteStatus = 'success'
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteStatus = 'rejected'
            })
    }
})

export default productSlice.reducer;