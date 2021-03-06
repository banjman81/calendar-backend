const bcrypt = require('bcryptjs')
const User = require('../model/User')
const Event = require('../../events/model/Event')
const jwt = require('jsonwebtoken')

const errorHandler = require('../../utils/errorHandler')

const {getNumberOfDays} = require('../../lib/createValidation/validateEventCreateData')


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
            error: e.message
        })
    }
}

async function login(req, res) {
    const {email, password} = req.body
    const errObj = {}
    try{
        let foundUser = await User.findOne({email: email})
        if(!foundUser){
            errObj.email = 'Email does not exist, Please register!'
            res.status(500).json({
                    message : 'error',
                    error: errObj
                })
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password)

            if(!comparedPassword){
                errObj.password = "Incorrect login information. Please Try again"
                res.status(500).json({
                        message : 'error',
                        error: errObj
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
        let foundUser = await User.findOne({email: req.params.email}).populate("events").populate("createdEvents")
        if(!foundUser){
            res.status(500).json({
                message: 'error',
                error: "User not found!"
            })
        }else{
            res.json({
                id: foundUser._id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                username: foundUser.username,
                email: foundUser.email,
                events: foundUser.events,
                createdEvents : foundUser.createdEvents
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

        let validSpot = true

        const foundUser = await User.findOne({email: decodedData.email}).populate("events")
        const foundEvent = await Event.findById(req.params.id)

        foundUser.events.map(event => {
            if(getNumberOfDays(event.startDate, foundEvent.startDate) == 0 ){
                return validSpot = false
            }else{
                if(getNumberOfDays(event.startDate, foundEvent.startDate) > 0){
                    if(getNumberOfDays(event.endDate, foundEvent.startDate)< 0){
                        return validSpot = false
                    }
                }

                if(getNumberOfDays(event.startDate, foundEvent.startDate) < 0){
                    if(getNumberOfDays(foundEvent.endDate, event.startDate) < 0){
                        return validSpot = false
                    }
                }
            }
        })

        const filteredUserEvent = foundUser.events.filter( event => event._id == req.params.id)
        if(filteredUserEvent.length > 0){
            throw({message: "You are already signed up."})
        }
        if(!validSpot){
            throw({message: 'You are already signed up for an event on this day.'})
        }

        if(foundEvent.attendees.length >= Number(foundEvent.capacity)){
            throw({message: "Sorry, this event is full."})
        }

        


        foundUser.events.push(foundEvent._id)
        console.log(168)
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

async function removeEvent(req, res){
    try{
        const decodedData = res.locals.decodedData

        const foundUser = await User.findOne({email: decodedData.email}).populate("events")
        const foundEvent = await Event.findById(req.params.id).populate('attendees')

        foundUser.events = foundUser.events.filter(event => String(event._id) !== String(foundEvent._id))
        foundEvent.attendees = foundEvent.attendees.filter(user => String(user._id) !== String(foundUser._id))

        const savedUser = await foundUser.save()
        const savedEvent = await foundEvent.save()

        res.json({
            message: "success",
            user: savedUser.events,
            event: savedEvent.attendees
        })

    }catch(e){
        res.status(500).json({
            message: "error",
            error: e.message
        })
    }
}

module.exports = {
    createUser,
    login,
    getUserByEmail,
    deleteUser,
    addEvent,
    removeEvent
}