import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { connect } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { MdOutlineDirectionsBike } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { editOrder, fetchOrders } from '../../features/orderSlice';
import Spinner from '../../components/Spinner/Spinner';

function OrdersList({ token, loadOrders, updateOrder }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
      setStatus('pending')
    try {
      async function ordersFetch() {
        await loadOrders(token).then(({payload}) => {
        setOrders(payload)
          setStatus('resolved')
      })
      }
      ordersFetch()
    } catch (error) {
      enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
    }
  }, [token])

  const handleChange = async ({ action, id }) => {
    setStatus('pending')
    try {
      await updateOrder({action, id, token}).then(() => {
          loadOrders(token).then(({ payload }) => {
            setOrders(payload)
          }).then(() => {
              enqueueSnackbar('Order status updated', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
              setStatus('resolved')
          })
      })
    } catch (error) {
        enqueueSnackbar('Error updating order...', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
    }
  }

  const rows = orders?.map((order, idx) => ({
        key: idx,
        id: order._id,
        name: order.shipping.name,
        email: order.shipping.email,
        status: order.delivery_status,
    }))

    const columns = [
  { field: 'id', headerName: 'User ID', width: 150 },
  { field: 'name', headerName: 'Order By: ', width: 130 },
  {
    field: 'email',
    headerName: 'Email Address',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Transaction status',
    width: 120,
    renderCell: (params) => (
      <div>
        {params.row.status === 'complete' ? <p className='pending'>Pending</p> : (
          params.row.status === 'dispatched' ? <p className='dispatched'>Dispatched</p> : (
            params.row.status === 'delivered' ? <p className='delivered'>Delivered</p> : <p>Error</p>
          )
        )}
      </div>
            )
  },
      {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <div className='actions'>
        <button className='dispatched' onClick={()=> handleChange({action: 'dispatched', id: params.row.id, token})}><MdOutlineDirectionsBike size={16}/></button>
        <button className='delivered' onClick={()=> handleChange({action: 'delivered', id: params.row.id, token})}><CiDeliveryTruck size={16}/></button>
        <button className='view' onClick={()=> navigate(`/admin/orders/${params.row.id}`)}><MdOutlineRemoveRedEye size={16}/></button>
        <button className='delete' onClick={() => handleDelete({ id: params.row.id, token })}><MdDeleteOutline size={16} /></button>
      </div>
            )
  }
  
    ];
  
  const handleDelete = async ({ id, token }) => {
    try {
      setStatus('pending')
      await axios.delete(`http://localhost:5000/order/${id}`, {
        headers: {
           Authorization: `Bearer ${token}`
         }
      }).then(() => {
        enqueueSnackbar('Order successfully deleted!', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        navigate('/')
        setStatus('resolved')
       })
     } catch (error) {
      enqueueSnackbar('Order deleting user...', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
     }
  }

  return (
    <div className='product-list orders'>
      {status === 'pending' ? <Spinner /> : (
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
    )}
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
      token: state.user.token,
    }
}

const mapDispatchToProps = (dispatch) => ({
  loadOrders: (token) => dispatch(fetchOrders({ token })),
  updateOrder: (data)=>dispatch(editOrder(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList)