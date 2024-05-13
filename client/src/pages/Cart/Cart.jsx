import React, { useEffect } from 'react'
import './cart.scss'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import {FaTimes} from 'react-icons/fa'
import { addToCart, clearCart, decreaseCartQuantity, getTotals, hideCart, removeFromCart } from '../../features/cartSlice';
import { useSnackbar } from 'notistack';
import { logo } from '../../components/Navbar/Navbar';
import PayButton from '../../components/PayButton/PayButton';


const Cart = ({ user, cart, removeItemFromCart, toggleCart, reduceItemQty, addToCart, clearCartItems, getSubtotal }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleRemoveFromCart = (item) => {
    removeItemFromCart(item);
    enqueueSnackbar('Removed from Cart', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
  }

  const handleDecreaseQty = (item) => {
    reduceItemQty(item)
    enqueueSnackbar(`${item.name} removed from cart`, { variant: 'warning', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
  }

  const handleAddToCart = (item) => {
    addToCart(item)
  }

  const toggleCartStatus = () => {
    toggleCart()
  }

  useEffect(() => {
    if (user?.expiresAt > new Date()) {
      navigate('/login')
      return enqueueSnackbar('Session Timeout', { variant: 'warning', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
    }
    getSubtotal()
    return 
  }, [getSubtotal, cart])


   return (
         <div className="cart-container" onClick={(e)=> e.stopPropagation()} >
           <div className="cart-title">
              {/* <h2>Shopping Cart</h2> */}
            <span onClick={toggleCartStatus}>{logo}</span>
            <Link to='/'>
              <FaTimes size={22} color='#000' onClick={toggleCartStatus}/>
           </Link>
           </div>
            {cart.cartItems.length === 0 ?
              (
              <div className="cart-empty">
                  <p>Your shopping cart is empty</p>
                  <div className="start-shopping" onClick={toggleCartStatus}>
                    <Link to='/' >
                      <IoIosArrowBack />
                      <span>Start shopping</span>
                    </Link>
                  </div>
              </div>
              ) :
              (
              <>
                <div className="titles">
                  <h3 className='product-title'>Product</h3>
                  <h3 className='price'>Price</h3>
                  <h3 className='quantity'>Quantity</h3>
                  <h3 className='total'>Total</h3>
                </div>
                <div className="cart-items">
                  {cart.cartItems?.map(cartItem => (
                    <div className="cart-item" key={cartItem._id}>
                      <div className="cart-product">
                          <img src={cartItem.image.url ? cartItem.image.url : cartItem.image} alt={cartItem.name} />
                          <div className="cart-product-details">
                            <h3 className='cart-product-name'>{cartItem.name}</h3>
                            <p className='cart-product-desc'>{cartItem.description}</p>
                            <button onClick={()=> handleRemoveFromCart(cartItem)}>Remove</button>
                          </div>
                      </div>
                      <div className="cart-product-price">
                        ${cartItem.price}
                      </div>
                      <div className="cart-product-quantity">
                          <button onClick={()=> handleDecreaseQty(cartItem)}>-</button>
                          <div className="count">{cartItem.quantity}</div>
                          <button onClick={()=>handleAddToCart(cartItem)}>+</button>
                      </div>
                      <div className="cart-product-total-price">
                          ${ cartItem.price * cartItem.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <button className="clear-cart" onClick={()=>clearCartItems()}>Clear cart</button>
                  <div className="cart-checkout">
                    <div className="sub-total">
                      <span>Subtotal</span>
                      <span className='amount'>${cart.cartTotalAmount }</span>
                    </div>
                    <p>Taxes and shipping calculate at checkout</p>
                    <PayButton cartItems={cart.cartItems} />
                    <div className="start-shopping" onClick={toggleCartStatus}>
                      <Link to='/'>
                        <IoIosArrowBack /><span>Continue shopping</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
              )
            }
          </div>
          )
        }

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    cartStatus: state.cart.showCart,
    user: state.user.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeItemFromCart: (item) => dispatch(removeFromCart(item)),
    reduceItemQty: (item) => dispatch(decreaseCartQuantity(item)),
    addToCart: (item) => dispatch(addToCart(item)),
    clearCartItems: () => dispatch(clearCart()),
    getSubtotal: () => dispatch(getTotals()),
    toggleCart: ()=> dispatch(hideCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)