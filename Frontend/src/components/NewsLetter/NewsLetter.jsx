import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Execlusive Offers on Your Email</h1>
      <p>Subsicribe to our newsletter and stay updated</p>
      <div>
        <input type="email" placeholder='Email Address' />
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
