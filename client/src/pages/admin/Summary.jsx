import React, { useEffect, useState } from 'react'
import {FaUsers, FaChartBar, FaClipboard} from 'react-icons/fa'
import Widget from './Summary Components/Widget';
import axios from 'axios';
import {connect} from 'react-redux'
import Chart from './Summary Components/Chart';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode'


const Summary = ({ token, products }) => {

  const [users, setUsers] = useState([])
  const [usersPerc, setUsersPerc] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersPerc, setOrdersPerc] = useState([])
  const [earnings, setEarnings] = useState([])
  const [earningsPerc, setEarningsPerc] = useState([])
  const [latest, setLatest] = useState([])

  
  function compare(a, b) {
    if (a._id < b._id) {
      return 1
    } else if (a._id > b._id) {
      return -1
    }
    return;
  }

  const decodedToken = jwtDecode(token)

  useEffect(() => {
    if (token && (new Date(decodedToken.exp * 1000) > new Date())) {
      async function fetchData(token) {
        const res = await axios.get('http://localhost:5000/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        res.data.sort(compare)
        setUsers(res.data)
        setUsersPerc(((res.data[0]?.total - res.data[1]?.total) / res.data[1]?.total) * 100)
      }
      fetchData(token)
    }
  }, [token, decodedToken.exp])

  useEffect(() => {
    if (token && (new Date(decodedToken.exp * 1000) > new Date())) {
      try {
        async function fetchData(token) {
        const res = await axios.get('http://localhost:5000/order/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        res.data.sort(compare)
        setOrders(res.data)
        setOrdersPerc(res.data.length > 1 ?
          ((res.data[0]?.total - res.data[1]?.total) / res.data[1]?.total) * 100 : res.data[0].total * 100
        )
      }
      fetchData(token)
      } catch (error) {
        console.log('error encountered', error)
      }
    }
  }, [token, decodedToken.exp])
  useEffect(() => {
    if (token && (new Date(decodedToken.exp * 1000) > new Date())) {
      async function fetchData(token) {
        const res = await axios.get('http://localhost:5000/order/earnings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        res.data.sort(compare)
        setEarnings(res.data)
        setEarningsPerc(res.data.length > 1 ?
          ((res.data[0]?.total - res.data[1]?.total) / res.data[1]?.total) * 100 : res.data[0].total * 100)
      }
      fetchData(token)
    }
  }, [token, decodedToken.exp])
  useEffect(() => {
    if ( token && (new Date(decodedToken.exp * 1000) > new Date())) {
      async function fetchLatestOrders(token) {
        const res = await axios.get('http://localhost:5000/order/latest', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setLatest(res.data)
      }
      fetchLatestOrders(token)
    }
  }, [token, decodedToken.exp])


  const data = [
    {
      icon: <FaUsers />,
      digit: users[0]?.total,
      isMoney: false,
      title: 'Users',
      color: 'rgb(102,108,255)',
      bgColor: 'rgba(102,108,255, 0.12)',
      percentage: usersPerc
  },
    {
      icon: <FaClipboard />,
      digit: orders[0]?.total,
      isMoney: false,
      title: 'Orders',
      color: 'rgb(38,198,249)',
      bgColor: 'rgba(38,198,249, 0.12)',
      percentage: ordersPerc
  },
    {
      icon: <FaChartBar />,
      digit: (earnings[0]?.total)/100,
      isMoney: true,
      title: 'Earnings',
      color: 'rgb(253,181,40)',
      bgColor: 'rgba(253,181,40, 0.12)',
      percentage: earningsPerc
  },
]

  return (
    <div className="summary">
      <div className="main-stats">
        <div className="overview">
          <div className="title">
            <h2>Overview</h2>
            <p>How your shop is performing compared to the previous month.</p>
          </div>
          <div className="widget-wrapper">
            {data?.map((data, idx) => (
              <Widget key={idx} data={data} />
            ))}
          </div>
        </div>
        <div className="chart">
          <Chart/>
        </div>
      </div>
      <div className="side-stats">
        <div className="latest">
          <h3>Latest Transactions</h3>
            {latest?.map((order, idx) => (
              <div className="order" key={idx}>
                <p>{order.shipping.name}</p>
                <p>${(order.subtotal / 100).toLocaleString()}</p>
                <p>{moment(order.createdAt).fromNow()}</p>
            </div>
            ))
          }
        </div>
        <div className="all-time">
          <h3>All Time Data</h3>
          <div className="info">
            <div className='title'>Users</div>
            <div className='data'>200</div>
          </div>
          <div className="info">
            <div className='title'>Products</div>
            <div className='data'>{products.length}</div>
          </div>
          <div className="info">
            <div className='title'>Orders</div>
            <div className='data'>200</div>
          </div>
          <div className="info">
            <div className='title'>Earnings</div>
            <div className='data'>$2000</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    products: state.product.items
  }
}

export default connect(mapStateToProps)(Summary)