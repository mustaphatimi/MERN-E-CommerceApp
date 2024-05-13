import React from 'react'

const Widget = ({data}) => {
    return (
        <div className="styled-widget">
            <div className="icon" style={{ color: `${data.color}`, backgroundColor: `${data.bgColor}`}}>
                {data.icon}
            </div>
            <div className="text">
                <h3>{data.isMoney ? '$' + data.digit?.toLocaleString() : data.digit?.toLocaleString()}</h3>
                <p>{data.title }</p>
            </div>
            <div className="percentage" style={{color: data.percentage < 0 ? 'rgb(255, 77, 73)' : 'rgb(114, 225, 40)'}}>
                {Math.floor(data.percentage) + '%'}
            </div>
        </div>
        )
}

export default Widget