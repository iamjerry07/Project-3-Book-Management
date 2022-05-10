const validate = require('../validators/validator')
const mongoose = require("mongoose")
const bookModel = require('../models/bookModel')
const bookModel = require('../models/reviewModel')
const reviewModel = require('../models/reviewModel')



const getDataByParams = async (req,res) => {
    try{
        let id = req.params.bookId
        if(!validate.isValidField(id)) return res.status(400).send({status :  false, message : "Book Id is Required"})
        if(!mongoose.isValidObjectId(id)) return res.status(400),send({status : false, message : "Invalid Book Id"})

        let findBookData = await bookModel.findOne({_id : id, isDeleted : false})
        if(!validate.isValidField(findBookData)) return res.status(404).send("Dataa Not Found")

        let findReviewData = await reviewModel.find({bookId : id, isDeleted : false}).select({isDeleted : 0})

        findBookData.reviewsData = findReviewData

        res.status(200).send({status : true, message : "Book List", data : findBookData})
    }
    catch(error){
        res.status(500).send({status : false, message : error.message})
    }
}