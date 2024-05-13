import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { clearCart } from '../../features/cartSlice'

const CheckoutSuccess = ({ deleteCart }) => {
  
  useEffect(() => {
    deleteCart()
  }, [deleteCart])
  return (
    <h2>CheckoutSuccess</h2>
  )
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteCart: ()=> dispatch(clearCart())
    }
}

export default connect(null, mapDispatchToProps)(CheckoutSuccess)