import './auth.scss';
import loginImg from '../../assets/imgs/login.png'
import { Link } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa';
import Card from '../../components/Card/Card'
import React, { useState } from 'react'
import { useLoginMutation } from '../../features/usersApi';
import { connect } from 'react-redux';
import { loginUser } from '../../features/userSlice';
import Spinner from '../../components/Spinner/Spinner';
import { useSnackbar } from 'notistack';
import BACKEND_API from '../../components/api';

const Login = ({ signIn }) => {

    const [data, setData] = useState({ email: '', password: ''})
    const [login, {isLoading}] = useLoginMutation()
    // const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (e) => {
    setData(data => (
      {
        ...data,
      [e.target.name]: e.target.value
      }
    ))
    }
  
   const handleSubmit = async (e) => {
    e.preventDefault();
      await login({ ...data })
        .then((res) => {
          const { data: userData, error } = res;
          if (userData) { 
            signIn(userData)
            const { user: {_id, name, email, isAdmin }, token } = userData
            localStorage.setItem('user', JSON.stringify({ _id, name, email, token, isAdmin }))
            return enqueueSnackbar('Successfully logged in...', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
          }
          enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
        })
  }

  return (
    <section className='container auth'>
          {isLoading && <Spinner />}
          <div className='img'>
              <img src={loginImg } width='400' alt='' ></img>
          </div>
          <Card>
          <div className='form'>
              <h2>Login</h2>
                  <form onSubmit={handleSubmit}> 
                  <input type='text' placeholder='Email' onChange={handleChange} name='email' required autoFocus/>
                  <input type='password' placeholder='Password' onChange={handleChange} name='password' required />
                  <button className='--btn --btn-primary --btn-block'>Login</button>
                  <div className='links'> 
                      <Link to='/reset'>Forgot Password?</Link>
                  </div>
                  <p>-- or --</p>
              </form>
            <button className='--btn --btn-danger --btn-block' ><FaGoogle color='#fff'/>  Login With Google</button>
              <span className='register'>
                  <p>Don't have an account?
                      <Link to='/register'> Register</Link>
                  </p>
          </span>
              </div>
        </Card>
    </section>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (user)=> dispatch(loginUser(user))
  }
}

export default connect(null, mapDispatchToProps)(Login)