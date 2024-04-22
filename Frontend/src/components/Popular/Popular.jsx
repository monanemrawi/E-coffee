import React, { useEffect, useState } from 'react'
import "./Popular.css"
import Item from '../Item/Item'

function Popular() {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/popular')
    .then((res) => res.json())
    .then((data) => setPopularProducts(data))
  }, [])

  return (
    <div className='popular'>
      <h1>POPULAR COFFEE PRODUCTS</h1>
      <hr />
      <div className="popular-items">
        {popularProducts.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  )
}

export default Popular
