const express = require('express');
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');

const router = express.Router();

//  UserApi
router.post('/createUser', userController.createUser);
router.post('/login', userController.login)

// BookAPI
router.post('/createBook', bookController.createBook);

//Delete Api
router.delete('/deleteBook/:bookId', bookController.deleteBook)

// Update Api
router.put('/updateBooksById', bookController.updateBooksById)

module.exports = router;