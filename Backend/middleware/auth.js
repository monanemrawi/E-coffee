const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate. ' })
    }
}

//middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('authToken');
    if (!token) {
        res.status(401).send({ errors: 'Please authenticate' });
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = data._id;
            next();
        } catch (e) {
            console.error('Error verifying token:', e);
            res.status(401).send({ errors: 'Please authenticate' });
        }
    }
};


module.exports = {
    auth,
    fetchUser

}
