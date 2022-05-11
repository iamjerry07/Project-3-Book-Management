const jwt = require('jsonwebtoken');
const authentication = async function(req, res, next) {
    try {
        const token = req.headers['x-auth-token'];
        if (!token)
            return res.status(400).send({ status: false, msg: "Token is required" });
        const decodedToken = jwt.verify(token, 'project3rd');
        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "Invalid user" });
           }   req.validToken = decodedToken.userID
          next();
        


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};

module.exports.authentication = authentication