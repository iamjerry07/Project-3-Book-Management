const express = require('express');
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const reviewController = require('../controller/reviewController')
const middleware = require('../middleware/middleware')
const router = express.Router();

//=============================================USER API===================================


//  UserApi
router.post('/createUser', userController.createUser);

router.post('/login', userController.login)



//=============================================BOOK API=====================================

// BookAPI
router.post('/createBook', middleware.authorization, bookController.createBook);

//GET API BY QUERY

router.get('/books', middleware.authorization, bookController.getDataByQuery)

//GET API BY PATHPARAMS
router.get('/books/:bookId', middleware.authorization, bookController.getDataByParams)

//Delete Api
router.delete('/deleteBook/:bookId', middleware.authorization, bookController.deleteBook)

// Update Api
router.put('/books/:bookId', middleware.authorization, bookController.updateBooksById)



//=============================================REVIEW API====================================


//Review API

router.post('/books/:bookId/review', reviewController.createReview)
module.exports = router;