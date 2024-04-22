import React, { useState } from 'react';
import './css/LoginSignup.css';

const LoginSignup = () => {

  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log('Login executed', formData);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === true) {
        localStorage.setItem('authToken', data.token);
        window.location.replace('/');
      } else {
        alert('Login Failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup Failed');
    }
  };

  const signup = async () => {
    console.log('Sign up executed');
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === true) {
        localStorage.setItem('authToken', data.token);
        window.location.replace('/');
      } else {
        alert('Signup Failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup Failed');
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className='loginsignup-fields'>
          {state === 'Sign Up' && <input name='name' onChange={changeHandler} value={formData.name} type='text' placeholder='Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type='text' placeholder='Email Address'/>
          <input name='password' value={formData.password} onChange={changeHandler} type='password' placeholder='Password' />
        </div>
        <button onClick={() => {state === 'Login' ? login() : signup()}}>Continue</button>
        {state === 'Sign Up' ?
          <p className='loginsignup-login'>Already have an account? <span onClick={() => {setState('Login')}}> Login here </span></p> :
          <p className='loginsignup-login'>Don't have an account? Create one <span onClick={() => {setState('Sign Up')}}> here</span></p>
        }
      </div>
    </div>
  );
};

export default LoginSignup;