const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {

    const token = req.headers.authorization;
    if (!token){
        res.status(401).json({error: 'token not provided, please login to continue.'});
    }
    else{
    jwt.verify(token, 'XU:}ZII>3pm)h-pKxONUSosZ!EY%gK', (err, value) => {

        if(err){
            res.status(401).json({error: 'authentication failed, please login to continue.'});
        }
        else{
            req.user = value;
            next();
        }
        })
    }
}

module.exports = { requireAuth }