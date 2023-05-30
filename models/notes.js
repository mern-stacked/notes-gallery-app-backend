const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Blueprint for the schema
const notesSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String, required: true },
    department: { type: String, required: true },
    uploader: { type: String, required: true },
    creator: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Note', notesSchema);