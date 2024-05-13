import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios'
import { connect } from 'react-redux';
import {jwtDecode} from 'jwt-decode'


const Chart = ({token}) => {

    const [data, setData] = useState([])
  const decodedToken = jwtDecode(token)


    // function compare(a, b) {
    //     if (a.createdAt > b.createdAt) {
    //         return -1
    //     } else if (a.createdAt < b.createdAt) {
    //         return 1
    //     } return
    // }
    useEffect(() => {
        if (token && (new Date(decodedToken.exp * 1000) > new Date())) {
            async function fetchData(token) {
                const res = await axios.get('http://localhost:5000/order/week-stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                // res.data.sort(compare)
                const chartData = res.data?.map((item) => {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
                    return {
                        day: days[item._id - 1],
                        amount: item.total / 100
                    }
                })
                setData(chartData)
            }
            fetchData(token)
        }
    }, [token])
    
    return (
        <>
            <h3>Earnings for the Last 7 days ($USD)</h3>
                <LineChart
                width={700}
                height={350}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                    <Tooltip />
                    <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
        </>
  )
}

const mapStateToProps = (state) => {
    return {
        token: state.user.token
    }
}

export default connect(mapStateToProps)(Chart)