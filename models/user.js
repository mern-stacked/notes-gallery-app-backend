const mongoose = require('mongoose');
const muvalidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    designation: { type:String, required: true },
    notes: [{ 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Note'
    }]
});

// Preprocessing of the password : Hashing and Salting the password before creating a user or instance of the user schema
userSchema.pre('save', function(next) {

   const user = this;

   if(!user.isModified('password')){
    return next();
   } 

   bcrypt.genSalt(10, (err, salt) => {

     if(err) { return next(err); }

     bcrypt.hash(user.password, salt, (err, hash) => {
        
        if(err) { return next(err); }

        user.password = hash; 
        next();
    });
    
 })

});

// Compare the passord generated during signup with the one while login 
userSchema.methods.comparePassword = function(candidatePassword) {
    
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {

            if(err) return reject(err) 
            
            if(!isMatch) return reject(false)

            resolve(true);

        })
    });
}

userSchema.plugin(muvalidator);

module.exports = mongoose.model('User', userSchema);