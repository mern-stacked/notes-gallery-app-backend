const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
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
    const { name, email, password, designation } = req.body;

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
        designation,
        notes: []
    });

     try {
        await createdUser.save();
        const token = jwt.sign({ userId: createdUser._id }, 'MY_SECRET_KEY');
        // res.status(201).json( { token } );
        res.status(201).json( { user: createdUser.toObject({ getters: true }), token } );
        // res.send({ token })
    } catch (err) {
        const error = new HttpError(
            'User Registration Failed. Please Try Again..',
            500
        );
        return next(error);
    } 

};

// Login Controller
const login = async (req, res, next) => {

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(422).send({ error: 'Must provide email and password.'})
    }
    
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

    if(!existingUser){
        return res.status(422).send({ error: 'Invalid password or email' });
    }

    try{
        await existingUser.comparePassword(password);
        const token = jwt.sign({ userId: existingUser._id }, 'MY_SECRET_KEY');
        res.status(201).json( { user: existingUser.toObject({ getters: true }), token } );
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    } 

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;