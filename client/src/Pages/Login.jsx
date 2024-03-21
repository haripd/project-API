import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate, NavLink } from 'react-router-dom'


const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

const navigate = useNavigate()

  const readValue = (e) => {
    const { name, value } = e.target
    setUser({...user, [name]:value})
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    try {
        console.log(`new User`, user)
        await axios.post(`/api/auth/login`, user)
        .then(res => {
          toast.success(res.data.msg)
          navigate(`/`)
        })
        .catch(err => toast.error(err.response.data.msg))
    } catch (error) {
        toast.error(error.message)
    }
  }
  return (
    <div className='container d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-12 d-sm-none d-md-block d-lg-block'> 
              <img src={`${process.env.PUBLIC_URL}/signup.png`} alt="" className='img-fluid'/>
            </div>
            <div className='col-md-6 col-lg-6 col-sm-12'> 
              <div className='card'>
                <div className='card-body'>

                  <form autoComplete='off' onSubmit={submitHandler}>
                      <div className='form-group mt-2'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' id='email' value={user.email} onChange={readValue} className='form-control' required/>
                      </div>
                      
                      <div className='form-group mt-2'>
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' id='password' value={user.password} onChange={readValue} className='form-control' required/>
                      </div>

                      <div className='form-group mt-2'>
                        <input type="submit" value="SigUp" className='btn bg-primary text-white' />
                      </div>
                  </form>
                  <NavLink to={`/register`} className="text-center">New Registered</NavLink>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Login