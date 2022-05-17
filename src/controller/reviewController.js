const validate = require("../validators/validator");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");


const createReview = async function(req, res) {
    try {
        let data = req.body

        if (!validate.isValidRequestBody(data))

            return res.status(400).send({ status: false, msg: "Data is required" })


        const bookId = req.params.bookId

        if (!validate.isValidField(bookId))

            return res.status(400).send({ status: false, msg: "BookId field is required" })


        if (!validate.isValidObjectId(bookId))

            return res.status(400).send({ status: false, msg: "Not a valid book Id" })


        let bookIdCheck = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!bookIdCheck)

            return res.status(404).send({ status: false, msg: "Book Not Present" })


        let { review, rating, reviewedBy } = req.body;

        if (!validate.isValidField(review))

            return res.status(400).send({ status: false, msg: "Review field is missingg" })


        if (!validate.isValidField(rating) || typeof rating != 'number')

            return res.status(400).send({ status: false, msg: "rating field must be number and cannot be empty" })

        // if (!validate.isValidField(reviewedBy))

        //     return res.status(400).send({ status: false, msg: "Reviewd field is missing" })


        if (!(data.rating >= 1 && data.rating <= 5))

            return res.status(400).send({ status: false, msg: "Rating is invalid" })

        const isBookPresent = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!isBookPresent) {
            return res.status(404).send({ status: false, message: "Book does not exist" })
        }

        // let reviewData = await reviewModel.create(data)


        // let book = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()


        // await reviewModel.find({ bookId: bookId, isDeleted: false })
        // book["reviewData"] = reviewData

        // return res.status(201).send({ status: true, message: 'Success', data: book })

        const update = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true, upsert: true }).select({ __v: 0 });

        const newData = { bookId, review, rating, reviewedBy, reviewedAt: new Date() };

        let toUpdate = update.toObject()
        toUpdate.review = await reviewModel.create(newData);

        return res.status(201).send({ status: true, message: "Review created successfully", data: toUpdate })


    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }
}


let updateReview = async(req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!validate.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid bookId" })
        if (!validate.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "invalid reviewId" })

        let data = req.body
        let { review, rating, reviewedBy } = data

        if (!validate.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "No data to update" })

        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!validate.isValidField(findBook)) return res.status(404).send({ status: false, message: "Book doesn't exist" })

        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!validate.isValidField(findReview)) return res.status(404).send({ status: false, message: "Review doesn't exist" })

        let updateData = {}

        if (!review && !rating && !reviewedBy) return res.status(400).send({ status: false, message: "provide correct data to update" })

        if (review) {
            if (!validate.isValidField(review) || typeof review == 'number') return res.status(400).send({ status: false, message: "review must be a type string and cannot be empty" })
            updateData.review = review
        }
        if (rating) {
            if (!validate.isValidNumber(rating) || typeof rating != 'number' || !(rating >= 1 && rating <= 5)) return res.status(400).send({ status: false, message: "rating must be a type number and should be between 1 - 5" })
            updateData.rating = rating
        }
        if (reviewedBy) {
            if (!validate.isValidField(reviewedBy) || typeof reviewedBy == 'number') return res.status(400).send({ status: false, message: "reviewer's name must be a type string and cannot be empty" })
            updateData.reviewedBy = reviewedBy
        }
        console.log(updateData)
        let findAndUpdate = await reviewModel.findOneAndUpdate({ _id: reviewId }, updateData, { new: true })
        let convertIntoObject = findBook.toObject()

        convertIntoObject.reviewsData = findAndUpdate

        return res.status(200).send({ status: true, message: "Sucessfully updated", data: convertIntoObject })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const deleteReviewById = async(req, res) => {
    try {

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'this is not a valid book Id' })
        }

        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: 'this is not a valid review Id' })
        }

        let findBook = await bookModel.findOne({ _id: bookId })

        if (!findBook) {
            return res.status(404).send({ status: false, message: "A book with this id does not exists" })
        }

        if (findBook.isDeleted) {
            return res.status(404).send({ status: false, message: "This book has been deleted" })
        }

        let findReview = await reviewModel.findOne({ _id: reviewId })

        if (!findReview) {
            return res.status(404).send({ status: false, message: "A review with this id does not exists" })
        }

        if (findReview.isDeleted) {
            return res.status(404).send({ status: false, message: "This review is already deleted" })
        }

        if (findReview.bookId != bookId) {
            return res.status(404).send({ status: false, message: "This review is not of this book" })
        }

        let deletetheReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true }, deletedAt: Date.now() }, { new: true, upsert: true })

        if (deletetheReview) {
            await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true, upsert: true })
        }

        return res.status(200).send({ status: true, message: 'review has been deleted', data: deletetheReview })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.deleteReviewById = deleteReviewById
module.exports.createReview = createReview
module.exports.updateReview = updateReview