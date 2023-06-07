const express = require('express');
const { check } =  require('express-validator');

const notesControllers = require('../controllers/notes-controller');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

// Retrive a note by id
router.get('/:nid', notesControllers.getNotesById);

// Retrive a note by user id
router.get('/user/:uid', notesControllers.getNotesByUserId);

// Create a Note
router.post('/', 
            // fileUpload.single('file'),
            [
                check('title')
                 .not()
                 .isEmpty(),
                check('description')
                 .not()
                 .isEmpty(),
                check('department')
                 .not()
                 .isEmpty(),
                // check('file')
                //  .not()
                //  .isEmpty()
            ],
            notesControllers.createNotes
        );

// Update a Note
router.patch('/:nid', notesControllers.updateNotes);

// Delete a note
router.delete('/:nid', notesControllers.deleteNotes);

module.exports = router; 