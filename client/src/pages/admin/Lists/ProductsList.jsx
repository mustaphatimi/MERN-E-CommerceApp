import React from 'react'
import './lists.scss'
import { DataGrid } from '@mui/x-data-grid';
import { connect } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../../features/productSlice';
import { useSnackbar } from 'notistack';
import Edit from '../Edit';
import Spinner from '../../../components/Spinner/Spinner';

function ProductsList({ items, token, deleteItem, deleteStatus }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const rows = items?.map((item, idx) => ({
        key: idx,
        id: item._id,
        image: item.image.url || item.image,
        name: item.name,
        desc: item.description,
        price: item.price.toLocaleString()
    }))

    const columns = [
  { field: 'id', headerName: 'ID', width: 220 },
        {
            field: 'image', headerName: 'Image', width: 80,
            renderCell: (params) => (
                <img src={params.row.image} style={{ width: '30px', height: '30px' }} alt='product' />
            )
        },
  { field: 'name', headerName: 'Product Name', width: 130 },
  {
    field: 'price',
    headerName: 'Unit Price ($)',
    width: 80,
  },
  {
    field: 'desc',
    headerName: 'Description',
    width: 130,
  },
      {
    field: 'actions',
    headerName: 'Actions',
    width: 130,
    renderCell: (params) => (
      <div className='actions'>
        <button className='view' onClick={()=> navigate(`/admin/product/${params.row.id}`)}><MdOutlineRemoveRedEye size={16}/></button>
        <Edit id={params.row.id} />
        <button className='delete' onClick={() => handleDelete(params.row.id)}><MdDeleteOutline size={16} /></button>
      </div>
            )
  }
  
    ];
  
  const handleDelete = async (id) => {
     try {
       await deleteItem({ id, token }).then((res) => {
      enqueueSnackbar('Product successfully deleted!', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      navigate('/')
       })
     } catch (error) {
      enqueueSnackbar('Error deleting product...', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
     }
  }

  return (
    <div className='product-list'>
    {deleteStatus === 'pending' && <Spinner/>}
      <DataGrid
        style={{ minWidth: '50%', width: '80%'}}
        getRowId={(row)=> row.id}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
      items: state.product.items,
      token: state.user.token,
      deleteStatus: state.product.deleteStatus
    }
}

const mapDispatchToProps = (dispatch) => ({
  deleteItem: (data) => dispatch(deleteProduct(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList)