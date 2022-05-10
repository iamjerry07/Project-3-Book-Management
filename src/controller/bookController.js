const bookModel = require('../models/bookModel')
const validate = require('../validators/validator')


const createBook = async function(req, res){
   let data =  req.body
   let { title, excerpt, userId, ISBN, category, subcategory,releasedAt } = data
    
//Empty body check
   if (!validate.isValidRequestBody(data)) 
   return res.status(400).send({ status: false, message: "Data is required" })
// Title check
   if (!validate.isValidField(title))
    return res.status(400).send({ status: false, message: "Title is required" })

    let titleCheck= await bookModel.findOne({title:data.title})
    if(titleCheck){
    return res.send({msg: `${titleCheck.title} Title already exists`})
    }
// Excerpt check
    if (!validate.isValidField(excerpt))
    return res.status(400).send({ status: false, message: "Excerpt is required" })

// userID check
    if (!validate.isValidField(userId)) 
    return res.status(400).send({ status: false, message: "UserId is required" })

    let userIDcheck = await bookModel.findOne({userId:data.userId})
    if(userIDcheck){
    return res.send({msg: `${userIDcheck.userId} UserID already exists`})
    }

// ISBN check
    if (!validate.isValidField(ISBN))
     return res.status(400).send({ status: false, message: "ISBN is required" })

     let isbnCheck = await bookModel.findOne({ISBN:data.ISBN})
    if(isbnCheck){
    return res.send({msg: `${isbnCheck.ISBN} ISBN already exists`})
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


   let createdData = await bookModel.create(data)
   res.status(201).send({status:true,message: 'Success', data: createdData})
}




module.exports.createBook= createBook