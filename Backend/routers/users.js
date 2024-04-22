const express = require('express')
const {auth} = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const User = require('../models/users')
const router = new express.Router()
const {fetchUser} = require('../middleware/auth')

//Registering the user
router.post('/signup', async (req, res) => {
    let cart = {};
    for (let i = 0; i< 40; i++) {
        cart[i] = 0;
    }
    const user = new User({
        ...req.body,
        cartData: cart})

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).json({ success: true, token, user: user._id }) // Include user ID in the response
    } catch(e) {
        res.status(500).send()
    }
})

//logging in the user
router.post('/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.json({ success: true, token, user: user._id }) // Include user ID in the response
    } catch (e) {
        res.status(400).send()
    }
})

//logging out the user
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//updating user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne({ _id: req.user._id });
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// saving products in cart 
router.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log('added', req.body.itemId );
        let userData = await User.findOne({ _id: req.userId });

        const itemId = req.body.itemId;
        userData.cartData[itemId] += 1;

        await User.findOneAndUpdate(
            { _id: req.userId }, 
            { cartData: userData.cartData }
        );

        return res.status(200).json({ message: 'Item added' });
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//removing products from cart
router.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        console.log('removed', req.body.itemId );
        let userData = await User.findOne({ _id: req.userId });

        const itemId = req.body.itemId;
        if (userData.cartData[itemId] > 0)
            userData.cartData[itemId] -= 1;

        await User.findOneAndUpdate(
            { _id: req.userId }, 
            { cartData: userData.cartData }
        );

        return res.status(200).json({ message: 'Item removed' });
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//get cart data
router.post('/getcart', fetchUser, async (req, res) => {
    console.log('Get cart');
    let userData = await User.findOne({_id: req.userId});
    res.json(userData.cartData);
})

module.exports = router

