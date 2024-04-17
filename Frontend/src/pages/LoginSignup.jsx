import React from 'react'
import './css/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className='loginsignup-fields'>
          <input type='text' placeholder='Name' />
          <input type='text' placeholder='Email Address'/>
          <input type='password' placeholder='Password' />
        </div>
        <button>Continue</button>
        <p className='loginsignup-login'>Already have an account? <span> Login here </span></p>
      </div>
    </div>
  )
}

export default LoginSignup
