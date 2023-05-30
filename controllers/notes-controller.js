const { validationResult } =  require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Note = require('../models/notes');
const User = require('../models/user');

// Alternate approaches to define the controllers
// function getPlaceById() { ... }
// function getPlaceById = function() { ... }

const getNotesById = async (req, res, next) => {
    const noteId = req.params.nid;

    let note; 

    try {
       note = await Note.findById(noteId);
    } catch (err) {
        // Network Error 
        const error = new HttpError(
            'Something went wrong, cannot find the note.',
             500 
        );
      return next(error);
    }

    if(!note){
        // Not a network but couldnot find a place for the provided id 
        const error = new HttpError(
            'Could not found find a place for the provided id.',
             404
        );
    return next(error);
    }

    res.json({ note: note.toObject({ getters: true }) });
}

const getNotesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userwithNotes;  
     
    try{
        userwithNotes = await Note.findById(userId).populate('notes');
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500 
        );
        return next(error);
    }

    console.log(userwithNotes)

    if(!userwithNotes || userwithNotes.length === 0){
        return next(
            new HttpError('No notes available of this user.', 404)
        );
    }
    res.json({ notes: userwithNotes.map(note => note.toObject( { getters: true })) });
}

const createNotes = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next (
          new HttpError('Invalid Inputs, Please Check!', 422)
        );
    }

    const {title, description, file, uploader, department, creator } = req.body;
    
    const createdNote = new Note({
        title,
        description,
        file,
        creator,
        department,
        uploader
    });

    // check if a user exists
    let user;

    try{
        user = await User.findById(creator);
    } catch (err){
        const error = new HttpError(
            'Creating a note failed, please try again.',
            500
        );
        return next(error);
    }
    
    // If the user exists save the note in DB.
    if(!user){
        const error = new HttpError('Couldnot find user for provided id', 404);
        return next(error);
    }
    
    console.log(user)
    
    try {
        const sess =  await mongoose.startSession();
        sess.startTransaction();
        await createdNote.save({ session: sess });
        user.notes.push(createdNote);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creation of note failed. Please Try Again..',
            500
        );
        return next(error);
    } 

    res.status(201).json({ note: createdNote });
}

const updateNotes = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(
            new HttpError('INVALID INPUTS PASSED, PLEASE CHECK!', 422)
        );
    }

    const { title, description, file, uploader, department } = req.body;
    const noteId = req.params.nid;

    let note;
    try{
       note = await Note.findById(noteId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, the note doesnot exist.', 
            500
        );
    return next(error); 
    }

    note.title = title;
    note.description = description;
    note.file = file;
    note.uploader = uploader;
    note.department = department;

    try{
        await note.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update the note.', 500
        );
      return next(error);
    }

    res.status(200).json({ note: note.toObject({ getters: true }) });
}


const deleteNotes = async (req, res, next) => {

    const noteId = req.params.nid;
    
    let note;
    try{
       note = await Note.findById(noteId).populate('creator');
       console.log(note)
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete the note.',
            500
        );
        return next(error);
    }

    if(!note){
        const error = new HttpError(
            'Couldnot find place for this Id.', 
            404
        );
        return next(error);
    }

    try{
        const sess =  await mongoose.startSession();
        sess.startTransaction();
        await note.deleteOne({ session: sess })
        note.creator.notes.pull(note);
        await note.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, unable to delete the note.',
            500
        );
        return next(error);
    }
        
    res.status(200).json({ message: 'Note deleted'})
}

exports.getNotesById = getNotesById;
exports.getNotesByUserId = getNotesByUserId; 
exports.createNotes = createNotes;
exports.updateNotes = updateNotes;
exports.deleteNotes = deleteNotes;
