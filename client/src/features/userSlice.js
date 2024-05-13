import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
        _id: '',
        name: '',
        email: '',
        isAdmin: null,
        token: ''
    }


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const { user: { email, name, _id, isAdmin }, token } = action.payload;
            state.name = name;
            state.email = email;
            state._id = _id;
            state.token = token;
            state.isAdmin = isAdmin;
        },
        logoutUser: (state) => {
            state.name = '';
            state.email = '';
            state._id = '';
            state.token = '';
            state.isAdmin = null;
        }
    }
})

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;