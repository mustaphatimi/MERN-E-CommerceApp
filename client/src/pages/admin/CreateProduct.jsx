import React, { useState } from 'react'
import { createProduct } from '../../features/productSlice';
import { connect } from 'react-redux'
import Spinner from '../../components/Spinner/Spinner';
import {useSnackbar} from 'notistack'
import { useNavigate } from 'react-router-dom';

const CreateProduct = ({ addProduct, createStatus, token }) => {
  const [productImg, setProductImg] = useState('')
  const [rawImg, setRawImg] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()


  const [data, setData] = useState({
    name: '',
    brand: '',
    price: '',
    description: ''
  })

  const transformFile = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setProductImg(reader.result)
      }
    } else {
    setProductImg('')
    }
  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setRawImg(file)
    transformFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({data: {...data, image: rawImg}, token})
        .then((res) => {
        enqueueSnackbar('Product successfully created...', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        navigate('/')
      })
    } catch (error) {
        enqueueSnackbar('Error creating product..', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
    }
  }

  const handleChange = (e) =>{
    setData((data) => ({
      ...data,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className='add-container'>
      {createStatus === 'pending' && <Spinner/>}
      <form className="product-form" onSubmit={handleSubmit}>
        <h3>Add new product</h3>
        <input type="text" placeholder='name' name='name' onChange={handleChange}/>
        <input type="text" placeholder='brand' name='brand' onChange={handleChange}/>
        <input type="text" placeholder='price' name='price'onChange={handleChange}/>
        <textarea name='description' placeholder='short description' onChange={handleChange}></textarea>
        <input type="file" accept='image' name='image' onChange={handleUpload} />
        <button>Create Product</button>
      </form>
      <div className="product-image">
        {productImg ? 
          <img src={productImg} alt='' /> : <p>Image preview will appear here</p>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    createStatus: state.product.createStatus,
    token: state.user.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addProduct: (data) => dispatch(createProduct(data))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateProduct)