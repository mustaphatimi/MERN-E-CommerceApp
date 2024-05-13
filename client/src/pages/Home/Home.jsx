import React, { useEffect, useState } from 'react'
import './home.scss'
import { connect } from 'react-redux'
import { addToCart, hideCart } from '../../features/cartSlice';
import {useSnackbar} from 'notistack'
import Spinner from '../../components/Spinner/Spinner';
import {jwtDecode} from 'jwt-decode'
import { productsFetch } from '../../features/productSlice';
import { useNavigate } from 'react-router-dom';


const Home = ({ token, addItemToCart, removeCart, products, fetchStatus }) => {
  const [data, setData] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const decodedToken = jwtDecode(token)
  const navigate = useNavigate()
  
  const handleAddToCart = (item) => {
    addItemToCart(item)
    enqueueSnackbar('Added to Cart', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
  }

  useEffect(() => {
    if (token && (new Date(decodedToken.exp * 1000) > new Date())) {
        return setData(products)
    }
    enqueueSnackbar('Session Timeout...', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
    navigate('/login')
  }, [token, products])

  return (
    <div className="home-container">
      {fetchStatus === 'pending' ? (<Spinner/>) : fetchStatus === 'rejected' ? <p>Oops! An error occured...</p> : (
        <>
        <h2>New Arrivals</h2>
        <div className="products">
          {data?.map(product =>
            <div key={product._id} className="product">
              <h3>{product.name}</h3>
              <img src={product.image.url ? product.image.url : product.image} alt={product.name} />
              <div className="details --flex-between">
                <span>{product.description}</span>
                <span className="price">${product.price}</span>
              </div>
                <button onClick={()=>handleAddToCart(product)}>Add To Cart</button>
          </div> )}
        </div>
      </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    products: state.product.items,
    fetchStatus: state.product.status
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(addToCart(item)),
    removeCart: () => dispatch(hideCart()),    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)