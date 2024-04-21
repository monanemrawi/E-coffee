const express = require('express')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const User = require('../models/users')
const router = new express.Router()

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
        res.status(201).json({ success: true, token })
    } catch(e) {
        res.status(500).send()
    }
})

//logging in the user
router.post('/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.json({ success: true, token })
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

//logging out the user from everywhere
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
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

module.exports = router

//TODO - create frontend for these endpoints: logout, logoutall, update user, delete user
//TODO - create newsletter page