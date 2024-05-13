import React from 'react';
import './spinner.scss';
import ReactDOM from 'react-dom';

const Spinner = () => {
  return ReactDOM.createPortal(
      <div className='wrapper'>
          <div className='loader'>
              <div className='loading-spinner'></div>
        </div>
      </div>,
      document.getElementById('loader')
  )
}

export default Spinner;