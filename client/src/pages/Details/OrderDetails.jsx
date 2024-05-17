import axios from 'axios'
import './details.scss'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import Spinner from '../../components/Spinner/Spinner'
import BACKEND_API from '../../components/api'

const OrderDetails = ({token}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [order, setOrder] = useState('')
  const [status, setStatus] = useState('')


  useEffect(() => {
    setStatus('pending')
    async function fetchOrder(token) {
      try {
        await axios.get(`${BACKEND_API}/order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        }).then((res) => {
          if (res) {
            setOrder(res.data)
            return setStatus('resolved') 
          }
        enqueueSnackbar(`Error fetching order`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        navigate('/admin/orders')
      })
      } catch (error) {
        enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
      }
    }
    fetchOrder(token)
  }, [id, token])
  return (
    <>
    {status === 'pending' || !order ? (<Spinner />) : (
        <div className='product-details'>
          <div className="product-container">
            <div className="info-container">
              <h3>Order ID: {order._id}</h3>
              <p><span>Initiator: </span>{order.shipping.name}</p> 
              <p><span>Email: </span> {order.shipping.email}</p>
              <p><span>Shipping Location: </span> {order.shipping.address.city}, {order.shipping.address.country }</p>
              <p><span>Value: </span>${(order.total / 100).toLocaleString()}</p>
              <p><span>Date Initiated: </span>{moment(order.createdAt).add(24, 'hours').format('LLL')}</p>
              <p><span>Payment Status: </span>{order.payment_status}</p>
              <p><span>Delivery Status: </span>{order.delivery_status}</p>
            </div>
          </div>
        </div>
      )}
      </>
  )
}

const mapStateToProps = (state) => ({
  token: state.user.token
})

export default connect(mapStateToProps)(OrderDetails)