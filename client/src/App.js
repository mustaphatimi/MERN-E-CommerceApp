// import './App.scss';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Navbar/Navbar';
import { Cart, Home, NotFound } from './pages';
import Footer from './components/Footer/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess';
import Dashboard from './pages/admin/Dashboard';
import CreateProduct from './pages/admin/CreateProduct'
import Product from './pages/admin/Product'
import Summary from './pages/admin/Summary'
import { useEffect, useState } from 'react';
import { useLogoutMutation } from './features/usersApi';
import { useSnackbar } from 'notistack';
import { logoutUser } from './features/userSlice';
import { useIdleTimer } from 'react-idle-timer';
import ProductsList from './pages/admin/Lists/ProductsList';
import Users from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import OrderDetails from './pages/Details/OrderDetails';
import ProductDetails from './pages/Details/ProductDetails';
import UserDetails from './pages/Details/UserDetails';

function App({ user, signOut }) {
  const { isAdmin, token } = user;
  const { enqueueSnackbar } = useSnackbar();
  const [logout] = useLogoutMutation();
  const [state, setState] = useState('Active')
  const [remaining, setRemaining] = useState(0)


  const onIdle = async (e) => {
    if (window.location.pathname === '/login') {
      return;
    }
      await logout().unwrap()
        .then(() => {
          signOut();
          localStorage.clear()
          enqueueSnackbar('Session Timeout', { variant: 'warning', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        })
    }

const onActive = () => {
    setState('Active')
  }
  
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 1_000 * 60 * 60,
    throttle: 500
  })

  useEffect(() => {
    let interval;
    if (window.location.pathname === '/login') {
      return;
    }
    interval = setInterval(() => {
        setRemaining(Math.ceil(getRemainingTime() / 1000))
      }, 1000)
    return () => clearInterval(interval)
})

  

  // useEffect(() => {
  //   if (window.location.pathname === '/login') {
  //     return;
  //   }

  //   async function fetchUser(id, token) {
  //     try {
  //       await axios.get(`http://localhost:5000/user/${id}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       })
  //     } catch (error) {
  //       if (error && error.response.data === 'Session Timeout') {
  //         await logout().unwrap()
  //           .then(() => {
  //             signOut();
  //             localStorage.clear()
  //             enqueueSnackbar(error.response.data, { variant: 'warning', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
  //           })
  //       }
  //     }
  //   }
  //   fetchUser(_id, token)
    
  // }, [token])


  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={token ? (<Home/>) : (<Navigate to='/login'/>)} />
          <Route path='/cart' element={token ? (<Cart/>) : (<Navigate to='/login'/>)} />
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={!token ? (<Login />) : (<Navigate to='/' message='Not Authorized' />)} />
          <Route path='/admin' element={token && isAdmin ? (<Dashboard />) : (<Navigate to='/' />)}>
            <Route path='product' element={token ? (<Product />) : (<Navigate to='/' />)}>
              <Route index element={<ProductsList />} />
              <Route path=':id' element={<ProductDetails />} />
              <Route path='create-product' element={token ? (<CreateProduct/>) : (<Navigate to='/'/>)} />
            </Route>
            <Route path='users'>
              <Route index element={token ? (<Users />) : (<Navigate to='/' />)}/>
              <Route path=':id' element={token ? (<UserDetails />) : (<Navigate to='/' />)} />
            </Route>
            <Route path='orders' >
              <Route index element={token ? (<Orders />) : (<Navigate to='/' />)}/>
              <Route path=':id' element={<OrderDetails />} />
            </Route>
            <Route path='summary' element={token ? (<Summary/>) : (<Navigate to='/'/>)} />
          </Route>
          <Route path='/register' element={!token ? (<Register />) : (<Navigate to='/' />)} />
          <Route path='/checkout-success' element={token ? (< CheckoutSuccess/>) : (<Navigate to='/login'/>)} />
        </Routes>
        <Footer/>
      </Router>
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(logoutUser()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
 