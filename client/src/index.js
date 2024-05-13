import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import productReducer, { productsFetch } from './features/productSlice';
import { productsApi } from './features/productsApi';
import cartReducer, { getTotals } from './features/cartSlice';
import {SnackbarProvider} from 'notistack'
import { usersApi } from './features/usersApi';
import userReducer from './features/userSlice';
import orderReducer from './features/orderSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    orders: orderReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productsApi.middleware, usersApi.middleware])
})

store.dispatch(getTotals())
store.dispatch(productsFetch())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </Provider>
    </React.StrictMode>
);
