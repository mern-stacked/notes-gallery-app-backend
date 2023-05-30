const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

// Get all the users
const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err){
        const error = new HttpError(
            'Fetching users failed, please try again.',
            500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true }))});
}

//Signup Controller
const signup = async (req, res, next) => {

    const errors = validationResult(req);   
    if(!errors.isEmpty()){
        return next(
           new HttpError('Invalid inputs passed, please check entered data.', 422)
        );
    }
    const { name, email, password, image, designation } = req.body;

    let userExists;
    try {
        userExists = await User.findOne({ email })
    } catch(err){
        const error = new HttpError(
            'Signup failed! Please try again later.',
            500
        );
        return next(error);
    }

    if(userExists){
        const error = new HttpError(
            'User exists already, Please login instead.', 
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password,
        image,
        designation,
        notes: []
    });

     try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'User Registration Failed. Please Try Again..',
            500
        );
        return next(error);
    } 

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Login Controller
const login = async (req, res, next) => {
    const {email, password} = req.body;
    
    let existingUser; 
    try{
        existingUser = await User.findOne({ email })
    } catch (err){
        const error = new HttpError(
            'Unable to Signin, please try again later.',
            500
        );
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials.',
            401
        );
        return next(error);
    }

    res.json({ message: 'Logged In!'});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;