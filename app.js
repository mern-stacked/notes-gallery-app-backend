const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const notesRoutes = require('./routes/notes-routes');
const userRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-error');

const app = express();

require('dotenv').config()

const connectDB = require('./mongoConnect')

connectDB()

app.use(bodyParser.json());
// Registering the imported routes as a middleware 
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    throw new HttpError('Unable to find the specified Route', 404);
})

// Middleware for Error Handling
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// mongoose.connect('mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@my-first-cluster.tzpnedp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority').then(() => {
//         app.listen(5000);
//     }).catch(err => {
//         console.log(err);
//     });
const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log("Server is up and running on port" + PORT)
})
