import React, { useState } from 'react'
import './auth.scss'
import registerImg from '../../assets/imgs/register.png'
import Card from '../../components/Card/Card'
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack'
import Spinner from '../../components/Spinner/Spinner';
import { useRegisterMutation } from '../../features/usersApi';
import { connect } from 'react-redux';
import {loginUser} from '../../features/userSlice'

const Register = ({login}) => {

    const [data, setData] = useState({ name: '', email: '', password: '', cPassword: '' })
  const [register, {isLoading}] = useRegisterMutation()
//   const navigate = useNavigate()
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
      const { name, email, password, cPassword } = data;
      if (password !== cPassword) {
        enqueueSnackbar('Passwords do not match!', { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } })
      }
    await register({ name, email, password })
      .then((res) => {
        const { data: userData, error } = res;
          if (userData) {
            const { user: { _id, name, email, isAdmin }, token } = userData;
            login(userData)
            localStorage.setItem('user', JSON.stringify({ _id, name, email, token, isAdmin }))
            return enqueueSnackbar('Registration successful...', { variant: 'success', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } }) 
          }
          enqueueSnackbar(`${error.data}`, { variant: 'error', autoHideDuration: 1000, anchorOrigin: { vertical: 'top', horizontal: 'right' } }) 
        })
  }
    
  return (
        <section className='container auth'>
      {isLoading && <Spinner />}
          <Card>
            <div className='form'>
              <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                  <input type='text' placeholder='Username' name='name' value={data.name} onChange={handleChange} required autoFocus/>
                  <input type='text' placeholder='Email' name='email' value={data.email} onChange={handleChange} required/>
                  <input type='password' placeholder='Password' name='password' value={data.password} onChange={handleChange} required />
                  <input type='password' placeholder='Confirm Password' name='cPassword' value={data.cPassword} onChange={handleChange} required />
                  <button className='--btn --btn-primary --btn-block'>Register</button>
                </form>
                <span className='register'>
                  <p>Already have an account?
                      <Link to='/login'> Login</Link>
                  </p>
                </span>
            </div>
          </Card>
          <div className='img'>
              <img src={registerImg } width='400' alt='' ></img>
          </div>
    </section>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user)=> dispatch(loginUser(user))
  }
}

export default connect(null, mapDispatchToProps)(Register)