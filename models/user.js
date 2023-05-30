const mongoose = require('mongoose');
const muvalidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    designation: { type:String, required: true },
    notes: [{ 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Note'
    }]
});

userSchema.plugin(muvalidator);

module.exports = mongoose.model('User', userSchema);