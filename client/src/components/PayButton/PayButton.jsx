import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import BACKEND_API from '../api'

const PayButton = ({ cartItems, user }) => {
    const handleCheckout = async () => {
        await axios.post(`${BACKEND_API}/stripe/create-checkout-session`, {
            cartItems,
            userId: user._id
        }).then((res) => {
                if (res.data.url) {
                    window.location.href = res.data.url;
                }
            }).catch((err) =>
                console.log(err, 'Error processing payment...'))
    }
    return (
        <>
            <button onClick={handleCheckout}>Checkout</button>
        </>
  )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(PayButton)