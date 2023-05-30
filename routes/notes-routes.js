const express = require('express');
const { check } =  require('express-validator');

const notesControllers = require('../controllers/notes-controller');

const router = express.Router();

// Retrive a note by id
router.get('/:nid', notesControllers.getNotesById);

// Retrive a note by user id
router.get('/user/:uid', notesControllers.getNotesByUserId);

// Create a Note
router.post('/', 
            [
                check('title')
                 .not()
                 .isEmpty(),
                check('description')
                 .isLength({ min: 5 }),
                check('uploader')
                 .not()
                 .isEmpty(),
                check('department')
                 .not()
                 .isEmpty()
            ],
            notesControllers.createNotes
        );

// Update a Note
router.patch('/:nid', notesControllers.updateNotes);

// Delete a note
router.delete('/:nid', notesControllers.deleteNotes);

module.exports = router; 