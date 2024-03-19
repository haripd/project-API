const {
    StatusCodes
} = require('http-status-codes')
const UserModel = require('../model/user')
const readAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find()
        res.json({
            status: true,
            users
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }
}
const bcrypt = require('bcryptjs')
// const bcrypt = require('bcryptjs/dist/bcrypt')
const generateToken = require('../util/token')
const mailSend = require('../config/mail')
// const generateToken = require('../middleware/')
//register
const register = async (req, res) => {
    try {
        // read the data
        const {
            name,
            email,
            mobile,
            password,
            role
        } = req.body
        //check whether user, mobile and password registered 
        let extEmail = await UserModel.findOne({
            email
        })

        if (extEmail)
            return res.status(StatusCodes.CONFLICT).json({
                status: false,
                msg: `${email} id already exists`
            })

        let extMobile = await UserModel.findOne({
            mobile
        })
        if (extMobile)
            return res.status(StatusCodes.CONFLICT).json({
                status: false,
                msg: `${mobile} number already exists`
            })

        // password 
        let encpass = await bcrypt.hash(password, 10)

        //salt => encrypted data(alpha numberical)

        //method to store in db
        let newUser = await UserModel.create({
            name,
            email,
            mobile,
            //password is stored in salt format [alpha numerical]
            password: encpass,
            role
        })
        let template = `<div>
                <h1> Hi ${newUser.name},</h1>
                <p>You have successfully Registered at ${new Date().toString()}</p>
                <h3 style="padding: 10px; background: skyblue;">
                        <strong>Username</strong>:
                        ${newUser.email}
                        <br>
                        <strong>Username</strong>: <span style:"color:'white';">
                        ${password}
                        </span>
                </h3>
        </div>`

        let emailRes = await mailSend(newUser.email, "Login Information", template)

        // final response
        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            msg: "User registered successfully",
            data: newUser
        })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }
}

//login
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body


        //get the email from DB
        let extEmail = await UserModel.findOne({
            email
        })
        //if does not exist then user is not created
        if (!extEmail)
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                msg: `${email} id doesnt exists`
            })

        // validate the password    
        let passVal = await bcrypt.compare(password, extEmail.password)

        if (!passVal)
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                msg: `passwords are not matched`
            })
        // generate the auth token
        let authToken = await generateToken(extEmail._id)

        let template = `<h1> Hi, ${extEmail.email} Successfully login into the profile at ${new Date().toString()}</h1>`
        let emailRes = await mailSend(extEmail.email, "Login Information", template)

        //store token in cookies
        res.cookie(
            "authToken", authToken, {
                httpOnly: true,
                signed: true,
                maxAge: 1 * 24 * 60 * 60 * 1000
            })

        res.status(StatusCodes.OK).json({
            msg: "login success",
            token: authToken,
            user: extEmail,
            emailres: emailRes
        })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }
}

//logout
const logout = async (req, res) => {
    try {
        res.clearCookie("authToken", {
            path: `/`
        })

        res.status(StatusCodes.OK).json({
            msg: "logout successfully"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }
}

//verify user
const verifyUser = async (req, res) => {
    try {
        // got the response from middleware to main controller for [verifyuser]
        //value is set in request id : req.userId
        const id = req.userId

        // read the user data
        let extUser = await UserModel.findById(id).select('-password')
        if (!extUser) {
            res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                msg: "requested user id not exists"
            })
        }
        res.status(StatusCodes.OK).json({
            status: true,
            msg: "User verified successfully",
            user: extUser
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: error.message
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyUser
}