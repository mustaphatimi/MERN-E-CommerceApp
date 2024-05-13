import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    // cartOwner: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    showCart: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            let product;
            const itemIdx = state.cartItems.findIndex(item => item._id === action.payload._id)
            if (itemIdx >= 0) {
            state.cartItems[itemIdx].quantity += 1;
            } else {
            product = {...action.payload, quantity: 1}
            state.cartItems.push(product)
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeFromCart(state, action) {
            const newCartItems = state.cartItems.filter(cartItem => cartItem._id !== action.payload._id)
            state.cartItems = newCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        decreaseCartQuantity(state, action) {
            const itemIdx = state.cartItems.findIndex(
                item => item._id === action.payload._id
            )
            if (state.cartItems[itemIdx].quantity > 1) {
                state.cartItems[itemIdx].quantity -= 1;
            } else {
                const newCartItems = state.cartItems.filter(
                    item => item._id !== action.payload._id
                )
                state.cartItems = newCartItems;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        clearCart(state, action) {
            state.cartItems = [];
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0
            localStorage.setItem('cartItems', state.cartItems)
        },
        getTotals(state, action) {
            let { total, quantity} = state.cartItems.reduce((cartTotal, cartItem) => {
                const { price, quantity } = cartItem;
                const itemPrice = price * quantity
                cartTotal.total += itemPrice;
                cartTotal.quantity += quantity;

                return cartTotal;
            }, {
                total: 0,
                quantity: 0
            })
            state.cartTotalAmount = total;
            state.cartTotalQuantity = quantity
        },
        toggleCart(state, action) {
            state.showCart = !state.showCart
        },
        hideCart(state, action) {
                state.showCart = false
        }
    }
})

export const { addToCart, removeFromCart, decreaseCartQuantity, clearCart, getTotals, toggleCart, hideCart } = cartSlice.actions

export default cartSlice.reducer