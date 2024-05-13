import React, { useState } from 'react';
import './navbar.scss';
import { Link, NavLink } from 'react-router-dom';
import {FaTimes, FaUserCircle} from 'react-icons/fa'
import { IoCartSharp, IoListOutline } from "react-icons/io5";
import { PiHandbagSimpleFill } from "react-icons/pi";
import { Cart } from '../../pages';
import { connect } from 'react-redux';
import { clearCart, toggleCart } from '../../features/cartSlice';
import { useLogoutMutation } from '../../features/usersApi';
import { useSnackbar } from 'notistack'
import { logoutUser } from '../../features/userSlice';

export const logo = (
          <div className='logo'>
            <Link to='/'><h2><span>myShup</span></h2></Link>
            <PiHandbagSimpleFill size={20} className='logo-icon' />
          </div>
)

const Navbar = ({ user, token, signOut, cartStatus, removeCart, switchCart }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [logout] = useLogoutMutation();
  const { enqueueSnackbar } = useSnackbar()
  
  const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

  const hideMenu = () => {
    setShowMenu(false)
  }

  const toggleCart = () => {
    switchCart()
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
        .then(() => {
          signOut();
          removeCart();
          localStorage.clear()
          enqueueSnackbar('Successfully logged out...', { variant: 'warning', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        })
    } catch (error) {
      enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
    }
  }

  return (
    <header>
      <div className='header'>
              {logo}
        <nav className={showMenu ? 'show-nav' : 'hide-nav'}>
          <div className='nav-wrap' onClick={toggleMenu}></div>
          <div className={cartStatus ? 'cart-wrap open-cart' : 'cart-wrap'} onClick={() => { toggleCart();  hideMenu() }}>
            {<Cart />}
          </div>
                <ul onClick={hideMenu}>
                    <li className='logo-mobile'>
                      {logo}
                      <FaTimes size={22} color='#f5f1da' onClick={hideMenu} />
                    </li>
                    <li>
                        <NavLink to='/'
                        >Home</NavLink>
                    </li>
                    <li>
                        <NavLink to='/contact'
                        >Contact Us</NavLink>
                    </li>
                </ul>
                <div className='header-right'>
                    <span className='links' >
              {!user?.token && <NavLink to='/login' onClick={hideMenu}>Login</NavLink>}
              {!user?.token && <NavLink to='/register' onClick={hideMenu}>Register</NavLink>}
              {user?.token && <a href='#profile' style={{ color: '#ff7722' }} onClick={hideMenu}><FaUserCircle size={16} className='user-icon' /> Hi, {user.email}</a>}
              {user?.token && <Link onClick={() => toggleCart()}>Cart<IoCartSharp size={20} /></Link>}
              {user?.isAdmin && <Link to='/admin' className='admin' onClick={hideMenu}>Admin</Link>}
              {user?.isAdmin && <Link to='/admin' className='admin-links' onClick={hideMenu}>Dashboard</Link>}
              {user?.isAdmin && <Link to='/admin/product' className='admin-links' onClick={hideMenu}>Products</Link>}
              {user?.isAdmin && <Link to='/admin/product/create-product' className='admin-links' onClick={hideMenu}>Create</Link>}
              {user?.isAdmin && <Link to='/admin/summary' className='admin-links' onClick={hideMenu}>Summary</Link>}
              {user?.token && <Link onClick={() => { handleLogout(); hideMenu()}}>Logout</Link>}
                    </span>
                </div>
              </nav>
              <div className='menu-icon'>
          <IoListOutline size={28} onClick={toggleMenu} />
        </div>
        </div>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {
        user: state.user,
        token: state.user.token,
        cartStatus: state.cart.showCart
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeCart: () => dispatch(clearCart()),
    switchCart: () => dispatch(toggleCart()),
    signOut: ()=>dispatch(logoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)