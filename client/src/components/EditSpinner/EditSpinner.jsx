import React from 'react';
import './editspinner.scss';
import ReactDOM from 'react-dom';

const EditSpinner = () => {
  return ReactDOM.createPortal(
          <div className='edit-loader'>
              <div className='edit-loading-spinner'></div>
        </div>,
      document.getElementById('loader')
  )
}

export default EditSpinner;