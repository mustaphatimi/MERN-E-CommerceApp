import axios from 'axios';
import './details.scss'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from '../../features/productsApi';
import Spinner from '../../components/Spinner/Spinner';
import { addToCart } from '../../features/cartSlice';
import { useSnackbar } from 'notistack';


const ProductDetails = ({ token, addToCart }) => {
  const { id } = useParams()
  const { data, error, isLoading } = useGetProductQuery({ id, token })
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = (product) => {
    addToCart(product)
    enqueueSnackbar('Added to Cart', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
  }

  return (
    <>
      {isLoading ? (<Spinner />) : error ? <p>Oops! An error occured...</p> : (
        <div className='product-details'>
          <div className="product-container">
            <div className="image-container">
              <img src={data[0].image.url || data[0].image} alt='product-image' />
            </div>
            <div className="info-container">
              <h3>{data[0].name}</h3>
              <p><span>Brand: </span> {data[0]?.brand || `No brand`}</p> 
              <p><span>Description: </span> {data[0].description}</p>
              <div className="price">
                ${data[0].price.toLocaleString()}
              </div>
              <button className="product-add" onClick={() => handleClick(data[0])}>Add To Cart</button>
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

const mapDispatchToProps = (dispatch) => ({
  addToCart: (product)=> dispatch(addToCart(product))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)