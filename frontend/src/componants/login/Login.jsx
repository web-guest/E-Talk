import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChatState } from '../../context/ChatProvider'
import {toast} from 'react-toastify'

function Login() {
  const [name, setName]=useState('')
  const [password, setPassword]= useState('')
  const {user, setUser, isLogin}= ChatState()
  const navigate=useNavigate()
  // const userInfo= JSON.parse(localStorage.getItem('userInfo'))
  useEffect(()=>{
    if(isLogin){
      navigate('/')
    }
  },[navigate,isLogin])
 
  const submitHandler=async (e)=>{
      e.preventDefault()
      try {
        const {data}= await axios.post('/api/users/login', {name, password})
        setUser(data)
        localStorage.setItem("userInfo", JSON.stringify(data))
        
            navigate('/')
      } catch (err) {
        toast.error(err)

      }
  }
  return (
    <>
    <div className='form-container'>
      <div className='form-header'>LOGIN</div>
      <div className="form-body">
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className='form-control' placeholder='username..' id='username' value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="text" className='form-control' placeholder='password..' id='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
            <div className="form-group">
              <input type="submit" value="login" className="btn" />

            </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login
