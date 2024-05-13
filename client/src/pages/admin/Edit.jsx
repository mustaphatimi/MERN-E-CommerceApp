import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { CiEdit } from "react-icons/ci";
import { connect } from 'react-redux';
import {useSnackbar} from 'notistack'
import { useNavigate } from 'react-router-dom';
import { editProduct, getProduct } from '../../features/productSlice';
import Loader from '../../components/Loader/Loader';
import EditSpinner from '../../components/EditSpinner/EditSpinner';

function Edit({token, id, updateProduct, editStatus, fetchItem, productStatus}) {
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const [productImg, setProductImg] = React.useState('')
    const [previewImg, setPreviewImg] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [product, setProduct] = React.useState({
        name: '',
        price: '',
        image: {},
        description: '',
        brand: ''
    });

    const transformFile = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewImg(reader.result)
      }
    }
  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImg(file)
      transformFile(file)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({data: {...product, image: productImg ? productImg : product.image }, token, id})
        .then((res) => {
          enqueueSnackbar('Product successfully updated...', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        navigate('/')
      })
    } catch (error) {
        enqueueSnackbar('Error updating product..', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        setOpen(false)
    }
  }

  const handleChange = (e) =>{
    setProduct((data) => ({
      ...data,
      [e.target.name]: e.target.value
    }))
  }

  const handleClickOpen = () => {
    setOpen(true);
    async function fetchProduct() {
      await fetchItem({ id, token }).then((res) => {
        setProduct(res.payload[0])
         setProductImg(res.payload[0].image)
          setPreviewImg(res.payload[0].image.url)
      })
    }
    fetchProduct()
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
        <button variant="outlined" onClick={handleClickOpen} className='edit'>
        <CiEdit size={16}/>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth='md'>
        {productStatus === 'pending' ? <EditSpinner /> : (
          <>
        <div className='add-container'>
              <form className="product-form" onSubmit={handleEdit}>
                    <h3>Edit product</h3>
                    <input type="text" placeholder='name' name='name' onChange={handleChange} value={product.name}/>
                    <input type="text" placeholder='brand' name='brand' onChange={handleChange} value={product.brand}/>
                    <input type="text" placeholder='price' name='price'onChange={handleChange} value={product.price}/>
                          <textarea name='description' placeholder='short description' onChange={handleChange} value={product.description}></textarea>
                    <input type="file" accept='image' name='image' onChange={handleUpload} />
                <button className='edit-button'>
                  {editStatus === 'pending' ? <Loader/> : 'Update Product'}
                    </button>
              </form>
              <div className="product-image">
                {previewImg ?
                  <img src={previewImg} alt='' /> : <img src={ product.image.url ? product.image.url : product.image} alt=''/>
                }
              </div>
          </div>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
            </>
          )}
        </Dialog>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  token: state.user.token,
  editStatus: state.product.editStatus,
    productStatus: state.product.productStatus
})

const mapDispatchToProps = (dispatch) => ({
    fetchItem: (params) => dispatch(getProduct(params)),
    updateProduct: (params)=> dispatch(editProduct(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)