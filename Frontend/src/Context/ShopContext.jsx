import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 41; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([])
    const [cartItems, setCartItems] = useState(getDefaultCart())

    useEffect(()=> {
        fetch('http://localhost:8000/allproducts')
        .then((res) => res.json())
        .then((data) => setAll_Product(data))

        if(localStorage.getItem('authToken')) {
            fetch('http://localhost:8000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'authToken': `${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: ''
            })
            .then((res) => res.json())
            .then((data) => console.log(data))
        }
    },[])

    const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    if (localStorage.getItem('authToken')) {
        fetch('http://localhost:8000/addtocart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'authToken': `${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId: itemId }) // Corrected syntax here
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }
};


    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}))
        if (localStorage.getItem('authToken')) {
            fetch('http://localhost:8000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'authToken': `${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId: itemId }) // Corrected syntax here
            })
                .then((res) => res.json())
                .then((data) => console.log(data))
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0) {
                let itemInfo = all_product.find((product)=> product.id===Number(item))
                totalAmount+= itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0) {
                totalItem+=cartItems[item]
            }
        }
        return totalItem;
    }


    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart}
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;