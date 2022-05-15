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


        if (!validate.isValidField(rating))

            return res.status(400).send({ status: false, msg: "Rating field is missing" })

        // if (!validate.isValidField(reviewedBy))

        //     return res.status(400).send({ status: false, msg: "Reviewd field is missing" })


        if (!(data.rating >= 1 && data.rating <= 5))

            return res.status(400).send({ status: false, msg: "Rating is invalid" })

        const isBookPresent = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!isBookPresent) {
            return res.status(404).send({ status: false, message: "Book does not exist" })
        }

        data["reviewedAt"] = Date.now()
        data["bookId"] = bookId


        // let reviewData = await reviewModel.create(data)


        // let book = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()


        // await reviewModel.find({ bookId: bookId, isDeleted: false })
        // book["reviewData"] = reviewData

        // return res.status(201).send({ status: true, message: 'Success', data: book })

        const update = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true, upsert: true });

        const newData = { bookId, review, rating, reviewedBy, reviewedAt: new Date() };


        const Review = await reviewModel.create(newData);

        return res.status(201).send({ status: true, message: "Review created successfully", data: { update, review: Review } })


    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createReview = createReview