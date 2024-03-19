const {
    StatusCodes
} = require('http-status-codes');
const UserModel = require('../model/user');

const readAllUsers = async (req, res, next) => {
    try {
        res.json({
            msg: "read all users"
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        });
    }
}