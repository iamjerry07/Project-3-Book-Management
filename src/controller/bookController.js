const validate = require('../validators/validator')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const moment = require("moment")


// CREATE BOOK API

const createBook = async function(req, res) {
    let data = req.body
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

    //Empty body check
    if (!validate.isValidRequestBody(data))
        return res.status(400).send({ status: false, message: "Data is required" })
            // Title check
    if (!validate.isValidField(title))
        return res.status(400).send({ status: false, message: "Title is required" })

    let titleCheck = await bookModel.findOne({ title: data.title })
    if (titleCheck) {
        return res.send({ msg: `${titleCheck.title} Title already exists` })
    }
    // Excerpt check
    if (!validate.isValidField(excerpt))
        return res.status(400).send({ status: false, message: "Excerpt is required" })

    // userID check
    if (!validate.isValidField(userId))
        return res.status(400).send({ status: false, message: "UserId is required" })

    let userIDcheck = await bookModel.findOne({ userId: data.userId })
    if (userIDcheck) {
        return res.send({ msg: `${userIDcheck.userId} UserID already exists` })
    }

    // ISBN check
    if (!validate.isValidField(ISBN))
        return res.status(400).send({ status: false, message: "ISBN is required" })

    let isbnCheck = await bookModel.findOne({ ISBN: data.ISBN })
    if (isbnCheck) {
        return res.send({ msg: `${isbnCheck.ISBN} ISBN already exists` })
    }

    // category check
    if (!validate.isValidField(category))
        return res.status(400).send({ status: false, message: "category is required" })

    // subcategory check
    if (!validate.isValidField(subcategory))
        return res.status(400).send({ status: false, message: "subcategory is required" })

    // releasedAt check
    if (!validate.isValidField(releasedAt))
        return res.status(400).send({ status: false, message: "Released date is required" })

    //regex check
    if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
        return res.status(400).send({ status: false, message: "Released date check" })
    }

    // data creation
    let createdData = await bookModel.create(data)
    res.status(201).send({ status: true, message: 'Success', data: createdData })
}


// GET BOOK BY ID API

const getDataByParams = async(req, res) => {
    try {
        let id = req.params.bookId
        if (!validate.isValidField(id)) return res.status(400).send({ status: false, message: "Book Id is Required" })
        if (!mongoose.isValidObjectId(id)) return res.status(400), send({ status: false, message: "Invalid Book Id" })

        let findBookData = await bookModel.findOne({ _id: id, isDeleted: false })
        if (!validate.isValidField(findBookData)) return res.status(404).send("Dataa Not Found")

        let findReviewData = await reviewModel.find({ bookId: id, isDeleted: false }).select({ isDeleted: 0 })

        findBookData.reviewsData = findReviewData

        res.status(200).send({ status: true, message: "Book List", data: findBookData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ==>
const deleteBook = async function(req, res) {
    try {
        let bookIdToBeDeleted = req.params.bookId

        if (!bookIdToBeDeleted) { //Book-Id is entered or not
            return res.status(400).send({ status: false, msg: "Book Id is not entered" })
        }
        let validBookId = await bookModel.findOne({ _id: bookIdToBeDeleted });
        if (!validBookId) { //Book-Id is valid or not
            return res.status(400).send({ status: false, msg: "Book Id is invalid" })
        }
        let isDeletedStatus = await bookModel.findOne({ _id: bookIdToBeDeleted, isDeleted: false });
        if (!isDeletedStatus) { //Check whether book-id is present or not
            return res.status(404).send({ status: false, msg: "Book is ALready deleted" })
        }
        let deletedDate = moment().format("DD-MM-YYYY, hh:mm a") //deleted date to be shown using moment


        let data = await bookModel.findByIdAndUpdate({ _id: bookIdToBeDeleted }, { isDeleted: true, deletedAt: deletedDate }, { new: true })

        return res.status(200).send({ status: true, msg: data })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



//updateBooksById

const updateBooksById = async function(req, res) {
    try {
        let data = req.body;

        if (!validate.isValidRequestBody(data))
            return res.status(400).send({ status: false, msg: "Data is required" })

        let bookId = req.params.bookId;

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Not a valid book Id" })
        }

        let bookIdCheck = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!bookIdCheck) {
            return res.status(400).send({ status: false, msg: "Book not found" })
        }

        if (!(req.validToken._id = bookIdCheck.userId)) {
            return res.status(401).send({ status: false, msg: "Unauthorized  Access" })
        }

        let isbnCheck = await bookModel.findOne({ ISBN: data.ISBN })
        if (isbnCheck) {
            return res.status(400).send({ msg: `${isbnCheck.ISBN} ISBN already exists` })
        }
        let updatedBooks = []

        if (isValidField(data.title)) {
            updatedBooks.title = data.title
        }

        if (isValidField(data.excerpt)) {
            updatedBooks.excerpt = data.excerpt
        }

        if (isValidField(data.ISBN)) {
            updatedBooks.ISBN = data.ISBN
        }

        if (isValidField(data.title)) {
            updatedBooks.title = data.title
        }

        let update = await bookModel.findOneAndUpdate({ _id: bookId, data: updatedBooks, })

        res.status(200).send({ status: true, message: "successfully Updated", data: update })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.updateBooksById = updateBooksById
module.exports.deleteBook = deleteBook
module.exports.createBook = createBook
module.exports.getDataByParams = getDataByParams