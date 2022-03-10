const bcrypt = require('bcryptjs')
const User = require('../model/User')
const Event = require('../../events/model/Event')
const jwt = require('jsonwebtoken')

const errorHandler = require('../../utils/errorHandler')


async function createUser(req, res){
    try{
        let salt = await bcrypt.genSalt(12)

        let {firstName, lastName, username, email, password, confirmPassword} = req.body

        password = await bcrypt.hash(password, salt)

        const createdUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
        })
    
        let savedUser = await createdUser.save()

        res.json({
            message: 'success',
            payload: savedUser
        })

    }
    catch(e){
        return res.status(500).json({
            message: 'error',
            error: errorHandler(e)
        })
    }
}

async function login(req, res) {
    const {email, password} = req.body
    try{
        let foundUser = await User.findOne({email: email})
        if(!foundUser){
            res.status(500).json({
                message: "error",
                error: 'Email does not exist, Please register!'
            })
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password)

            if(!comparedPassword){
                res.status(500).json({
                    message : 'error',
                    error: "Incorrecxt login information. Please Try again"
                })
            }else{
                let jwtToken = jwt.sign (
                    {
                        email: foundUser.email,
                        username: foundUser.username
                    },
                    process.env.JWT_USER_SECRET,
                    {expiresIn : '8h'}

                )

                res.json({
                    message: 'successafully logged in',
                    token : jwtToken
                })
            }
        }


    }catch(e){
        res.status(500).json({
            message: 'error',
            error: errorHandler(e)
        })
    }
}

async function getUserByEmail(req, res){
    try {
        let foundUser = await User.findOne({email: req.params.email})
        if(!foundUser){
            res.status(500).json({
                message: 'error',
                error: "User not found!"
            })
        }else{
            res.json({
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                username: foundUser.username,
                email: foundUser.email,
            })
        }
    }catch(e){
        res.status(500).json({
            message: "error",
            error: errorHandler(e)
        })
    }
}

async function deleteUser(req, res){
    try{
        const decodedData = res.locals.decodedData

        let foundUser = await User.findOne({email: decodedData.email})

        let deletedUser = await User.findByIdAndDelete(foundUser._id)

        res.json({
            message: 'User successfully deleted',
            payload: deletedUser
        })
    }catch(e){
        res.status(500).json({
            message: "errorx",
            error: e
        })
    }
}

async function addEvent(req, res){
    try{
        const decodedData = res.locals.decodedData

        const foundUser = await User.findOne({email: decodedData.email})
        const foundEvent = await Event.findById(req.params.id)

        const filteredUserEvent = foundUser.events.filter( event => event._id == req.params.id)

        if(foundEvent.attendees.length >= Number(foundEvent.capacity)){
            return res.status(500).json({
                message: 'error',
                error: "Sorry, this event is full."
            })
        }

        if(filteredUserEvent.length > 0){
            
            return res.status(500).json({
                message: 'error',
                error: "You are already signed up."
            })
        }


        foundUser.events.push(foundEvent._id)
        foundEvent.attendees.push(foundUser._id)

        await foundUser.save()
        await foundEvent.save()

        res.json({
            message: 'success',
            payload: foundEvent
        })
    }catch(e){
        return res.status(500).json({
            message: 'error adding event',
            error: e.message
        })
    }
    
}

module.exports = {
    createUser,
    login,
    getUserByEmail,
    deleteUser,
    addEvent
}