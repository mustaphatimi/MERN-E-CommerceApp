import React from 'react';
import './not-found.scss'
import errorImg from '../../assets/imgs/shutterstock.jpg'

const NotFound = () => {
  return (
      <>
          <section className='error'>
            <img src={errorImg} alt='page-not-found'/>
          </section>
      </>
  )
}

export default NotFound