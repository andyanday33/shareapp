const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err) => {
    //login errors
    if (err.message.includes('Password is incorrect')){
        return "Password is incorrect";
    }
    if (err.message.includes('Incorrect Username')){
        return "Username is incorrect";
    }

    //signup errors
    //duplicate error
    if (err.message.includes('Validation error')){
        return "That username is already in use";
    }
    //notnull violation errors
    //not null violation errors should be checked on the front end.
    if (err.message.includes('userName')){
        return "Username cannot be blank";
    }
    if (err.message.includes('firstNane')){
        return "First Name cannot be blank";
    }
    if (err.message.includes('lastName')){
        return "Last Name cannot be blank";
    }
    if (err.message.includes('email')){
        return "Email cannot be blank";
    }
    if (err.message.includes('password')){
        return "Password cannot be blank and must have a minimum lenght of 6";
    }
    //password length should be checked on front end. (min 6 - max 128)

    // console.log(err);
    // console.log(err.message);
}

const maxAge = 4 * 60 * 60; //4 Hours

const createToken = (userName) => {
    return jwt.sign({ userName }, 'XU:}ZII>3pm)h-pKxONUSosZ!EY%gK', { expiresIn: maxAge});
} 

module.exports.signup = async(req, res) => {
    try{
        const body = req.body;
        //A blank portfolia is associated with the user upon signup process
        const portfolio = await Portfolio.create({ 
            User: { 
                userName: body.userName,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: body.password
             }
        }, {include: [ User ]})
        const token = createToken(body.userName);
        res.status(200).json({token});
    }catch(err){
        console.error(err);
        handledError = handleErrors(err);
        res.status(404).json({error: handledError});
    }
}

module.exports.login = async(req, res) => {
    try{
        const user = await User.login(req.body.userName, req.body.password);
        
        const token = createToken(user.userName);
        res.status(200).json({token});

    }catch(err){
        //console.error(err);
        handledError = handleErrors(err);
        return res.status(404).json({ error: handledError });
    }
}