const userModel = require('../models/userModel')
const validate = require('../validators/validator')
const jwt = require("jsonwebtoken")

//Create User

const createUser = async (req, res) => {
    try {
        let data = req.body
        let { title, name, phone, email, password, address } = data

        if (!validate.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Data is required" })

        if (!validate.isValidField(title)) return res.status(400).send({ status: false, message: "Title is required" })

        if (!validate.isValidField(name)) return res.status(400).send({ status: false, message: "Name is required" })

        if (!validate.isValidField(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })

        if (!validate.isValidField(email)) return res.status(400).send({ status: false, message: "Email is required" })

        if (!validate.isValidField(password)) return res.status(400).send({ status: false, message: "Password is required" })

        if (address && typeof address == 'object' && validate.isValidRequestBody(address)) {

            if (!validate.isValidField(address.street)) return res.status(400).send({ status: false, message: "Street name is reuired and should be Valid" })

            if (!validate.isValidField(address.city)) return res.status(400).send({ status: false, message: "City name is reuired and should be Valid" })

            if (!validate.isValidField(address.pincode)) return res.status(400).send({ status: false, message: "Pin Code is reuired and should be Valid" })
        } else {
            return res.status(400).send({ status: false, message: "Address is required, Cannot be empty and Should be an object" })
        }
        let validTitle = ['Mr', 'Mrs', 'Miss']
        if (!validTitle.includes(title)) return res.status(400).send({ status: false, Error: "Title must be Mr, Mrs or Miss" })

        if (!(/^[a-zA-Z ]*$/.test(name))) return res.status(400).send({ status: false, message: `${name} is not a valid Name` })

        if (!validate.isValidMobileNo(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valid Phone Number` })

        const verifyPhone = await userModel.findOne({ phone: phone })
        if (verifyPhone) {
            return res.status(400).send({ status: false, message: `${phone} already used` })
        }

        if (!validate.isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid Email` })

        const verifyEmail = await userModel.findOne({ email: email })
        if (verifyEmail) {
            return res.status(400).send({ status: false, message: `${email} is already used` })
        }

        if (!(/^[a-zA-Z0-9!@#$%^&*]{8,30}$/.test(password))) return res.status(400).send({ status: false, message: "Password length should be min.8 and max.30" })

        let creatuser = await userModel.create(data)

        res.status(201).send({ status: true, message: "Sucess", data: creatuser })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        let data = req.body
        let { email, password } = data

        if (!validate.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Data is required" })

        if (!validate.isValidField(email)) return res.status(400).send({ status: false, message: "Email is required" })

        if (!validate.isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid Email` })

        if (!validate.isValidField(password)) return res.status(400).send({ status: false, message: "Password is required" })

        let findData = await userModel.findOne({ email: email, password: password, isDeleted: false })

        if (!validate.isValidField(findData)) return res.status(404).send({ status: false, message: "Invalid Email or Password" })

        let userId = findData._id

        let token = jwt.sign({ userId: userId }, "Uranium_project3_group10", { expiresIn: '1h' })

        res.status(201).send({ status: true, message: "Token Sucessfully Created", data: token })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}





module.exports.createUser = createUser;
module.exports.login = login