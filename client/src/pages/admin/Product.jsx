import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './dashboard.scss'

const Product = () => {

  const navigate = useNavigate()
  const handleCreate = () => {
  navigate('/admin/product/create-product')
  }
  
  return (
    <>
      <div className="title">
          <h3>Products</h3>
          <button onClick={handleCreate}>Add Product</button>
      </div>
      <Outlet/>
    </>
  )
}

export default Product