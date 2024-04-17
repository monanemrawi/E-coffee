import React, { useContext, useState } from 'react'
import "./Navbar.css"
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

    const [menu, setMenu] = useState('shop');
    const {getTotalCartItems} = useContext(ShopContext)

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src = { logo } alt = 'Sopping bags logo' />
            <p>SHOPPER</p>
        </div>
        <ul className='nav-menu'> 
            <li onClick={() => {setMenu('shop')}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu === 'shop' ? <hr/>: <></>}</li>
            <li onClick={() => {setMenu('coffee-beans')}}><Link style={{textDecoration: 'none'}} to='/coffee-beans'>Coffee Beans</Link>{menu === 'coffee-beans' ? <hr/>: <></>}</li>
            <li onClick={() => {setMenu('brewing-equipments')}}><Link style={{textDecoration: 'none'}} to='/brewing-equipments'>Brewing Equipments</Link>{menu === 'brewing-equipments' ? <hr/>: <></>}</li>
            <li onClick={() => {setMenu('accessories')}}><Link style={{textDecoration: 'none'}} to='/accessories'>Accessories</Link>{menu === 'accessories' ? <hr/>: <></>}</li>
        </ul>
        <div className='nav-login-cart'>
            <Link to='/login'><button>Login</button></Link>
            <Link to='/cart'><img src = { cart_icon } alt='cart logo' /></Link>
            <div className='nav-cart-count'>{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar
