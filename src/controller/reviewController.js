const validate = require("../validators/validator");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");


const createReview = async function(req, res) {
    try {
        let data = req.body

        if (!validate.isValidRequestBody(data))

            return res.status(400).send({ status: fals, msg: "Data is required" })


        let bookId = req.params.bookId

        if (!validate.isValidField(bookId))

            return res.status(400).send({ status: false, msg: "BookId field is required" })


        if (!validate.isValidObjectId(bookId))

            return res.status(400).send({ status: false, msg: "Not a valid book Id" })


        let bookIdCheck = await bookModel.findOne({ id_: bookId, isDeleted: false })

        if (!bookIdCheck)

            return res.status(400).send({ status: false, msg: "Book Not Present" })


        let review = data;
        let rating = data;
        let reviewerName = data;

        if (!validate.isValidField(review))

            return res.status(400).send({ status: false, msg: "Review field is missingg" })


        if (!validate.isValidField(rating))

            return res.status(400).send({ status: false, msg: "Rating field is missing" })


        if (!validate.isValidField(reviewerName))

            return res.status(400).send({ status: false, msg: "Review's Name is required" })


        if (!(data.rating >= 1 && data.rating <= 5))

            return res.status(400).send({ status: false, msg: "Rating is invalid" })


        let user = await userModel.findOne({ name: reviewerName, isDeleted: false })

        if (!user)

            return reviewerName = 'Guest'

        const newData = { bookId, review, rating, reviewerName, reviewedAt: new Date() }

        const Review = await reviewModel.create(newData);

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { review: 1 } });

        return res.status(201).send({ status: true, message: "Review created successfully", data: Review })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.createReview = createReview