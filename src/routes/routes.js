const express = require('express');
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const authentication = require('../middleware/middleware')
const router = express.Router();

//  UserApi
router.post('/createUser', userController.createUser);

router.post('/login', userController.login)

// BookAPI
router.post('/createBook', authentication.authentication ,bookController.createBook);

//GET API BY QUERY

router.get('/books', bookController.getDataByQuery)

//GET API BY PATHPARAMS
router.get('/books/:bookId', authentication.authentication,authentication.authorization ,bookController.getDataByParams)

//Delete Api
router.delete('/deleteBook/:bookId', authentication.authentication,authentication.authorization , bookController.deleteBook)

// Update Api
router.put('/books/:bookId', authentication.authentication,authentication.authorization , bookController.updateBooksById)

module.exports = router;