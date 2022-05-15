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
const deleteReviewById = async(req,res)=>{
    try{

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(!bookId){
            return res.status(400).send({status : false, message : 'bookId is not present'})
        }

        let validateBookId = mongoose.isValidObjectId(bookId)

        if(!validateBookId){
           return res.status(400).send({status : false, message : 'this is not a valid book Id'})
        }

        if(!reviewId){
            return res.status(400).send({status : false, message : 'reviewId is not present'})
        }

        let validatereviewId = mongoose.isValidObjectId(reviewId)
        if(!validatereviewId){
           return res.status(400).send({status : false, message : 'this is not a valid review Id'})
        }
        
        let findBook = await bookModel.findOne({_id : bookId})

        if(!findBook){
            return res.status(404).send({status : false, message : "A book with this id does not exists"})
        }

        if(findBook.isDeleted){
            return res.status(404).send({status : false, message : "This book has been deleted"})
        }

        let findReview = await reviewModel.findOne({_id : reviewId})

         if(!findReview){
             return res.status(404).send({status : false, message : "A review with this id does not exists"})
         }

         if(findReview.isDeleted){
             return res.status(404).send({status : false, message : "This review is already deleted"})
         }

        if(findReview.bookId != bookId){
            return res.status(404).send({status : false, message : "This review is not of this book"})
        }

        let deletetheReview = await reviewModel.findOneAndUpdate({_id : reviewId}, {$set : {isDeleted : true}, deletedAt : Date.now()}, {new : true, upsert : true})
        
        if(deletetheReview){
         await book.findOneAndUpdate({_id : bookId}, {$inc : {reviews : -1}}, {new : true, upsert : true})
        }

        return res.status(200).send({status : true, message : 'review has been deleted', data : deletetheReview})
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}
module.exports.deleteReviewById = deleteReviewById
module.exports.createReview = createReview