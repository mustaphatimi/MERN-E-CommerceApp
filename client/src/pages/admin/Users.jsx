import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { connect } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner';

function UsersList({ token }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    try {
      setStatus('pending')
      async function fetchUsers(token) {
        await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((res) => {
          setUsers(res.data)
          setStatus('resolved')
        })
      }
      fetchUsers(token)
    } catch (error) {
      enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
    }
  }, [token])

  const rows = users?.map((user, idx) => ({
    key: idx,
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }))

  const columns = [
    { field: 'id', headerName: 'User ID', width: 150 },
    { field: 'name', headerName: 'Username', width: 80 },
    {
      field: 'email',
      headerName: 'Email Address',
      width: 150,
    },
    {
      field: 'isAdmin',
      headerName: 'User status',
      width: 80,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div className='actions'>
          <button className='view' onClick={() => navigate(`/admin/users/${params.row.id}`)}><MdOutlineRemoveRedEye size={16} /></button>
          <button className='delete' onClick={() => handleDelete({ id: params.row.id, token })}><MdDeleteOutline size={16} /></button>
        </div>
      )
    }
  
  ];
  
  const handleDelete = async({id, token}) => {
    try {
      setStatus('pending')
      await axios.delete(`http://localhost:5000/user/${id}`, {
        headers: {
           Authorization: `Bearer ${token}`
         }
      }).then(() => {
        enqueueSnackbar('User successfully deleted!', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        navigate('/')
        setStatus('resolved')
       })
     } catch (error) {
      enqueueSnackbar('Error deleting user...', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      setStatus('resolved')
     }
  }

  return (
    <div className='product-list user'>
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

export default connect(mapStateToProps)(UsersList)