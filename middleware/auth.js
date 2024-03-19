const {
    StatusCodes
} = require("http-status-codes")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        // read the token from headers
        const token = req.header('Authorization')
        //verify the token:
        // res.json({ middle : token })
        await jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: false,
                    msg: "unauthorized token or token expired"
                })
            }
            //create request const 
            req.userId = user.id
            //continue connection to main controller
            next()
        })


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }

}
module.exports = auth