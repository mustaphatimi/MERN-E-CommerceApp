import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import {FaUsers, FaClipboard, FaStore, FaTachometerAlt} from 'react-icons/fa'

const Dashboard = () => {

  return (
    <>
    <div className='dashboard'>
      <div className="sidebar">
        <h3>Quick Links</h3>
        <hr className='hr'/>
        {/* <NavLink to='/admin'>Dashboard</NavLink> */}
        <NavLink to='/admin/summary'><FaTachometerAlt/> Summary</NavLink>
        <NavLink to='/admin/product'><FaStore/> Products</NavLink>
        <NavLink to='/admin/orders'><FaClipboard/> Orders</NavLink>
        <NavLink to='/admin/users'><FaUsers/> Users</NavLink>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default Dashboard