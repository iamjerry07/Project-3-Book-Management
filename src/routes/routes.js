const express = require('express');
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');

const router = express.Router();

//  UserApi
router.post('/createUser', userController.createUser);

router.post('/login', userController.login)

// BookAPI
router.post('/createBook', bookController.createBook);

//GET API BY QUERY

router.get('/books', bookController.getDataByQuery)

//GET API BY PATHPARAMS
router.get('/books/:bookId', bookController.getDataByParams)

//Delete Api
router.delete('/deleteBook/:bookId', bookController.deleteBook)

// Update Api
router.put('/updateBooksById', bookController.updateBooksById)

module.exports = router;