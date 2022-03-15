const User = require('../../users/model/User')
const Event = require('../model/Event')


async function createEvent(req, res) {
    
    
    const decodedData = res.locals.decodedData
    console.log('create event')
    console.log(req.file)
    try{

        let {title, eventType, shortDescription, longDescription, location, startDate, endDate, duration, capacity, image} = req.body

        const foundUser = await User.findOne({email: decodedData.email})

        const createdEvent = new Event({
            title,
            eventType,
            shortDescription,
            longDescription,
            location,
            startDate,
            endDate,
            duration,
            capacity,
            image,
            host : foundUser._id
        })

        let savedEvent = await createdEvent.save()

        res.json({
            message: 'success',
            payload: savedEvent
        })

    }catch(e){
        res.status(500).json({
            message: "error",
            error: e.message
        })
    }
}

async function deleteEvent(req, res) {
    
    const decodedData = res.locals.decodedData
    try{

        const foundUser = await User.findOne({email: decodedData.email})
        const foundEvent = await Event.findById(req.params.id).populate("attendees")

        if(String(foundUser._id) === String(foundEvent.host._id)){

            foundEvent.attendees.map(async attendee => {
                attendee.events = attendee.events.filter(event => String(event._id) !== String(foundEvent._id))

                await attendee.save()
            })

            const deletedEvent = await Event.findByIdAndDelete(req.params.id)

            res.json({
                message: "success",
                payload: deletedEvent
            })
        }else{
            throw({message: "You are not the host of this event."})
        }

    }catch(e){
        res.status(500).json({
            message: 'error',
            error: e.message
        })
    }
}

async function getAllEvents(req, res) {
    try{

        let allEvents = await Event.find().populate("host")

        res.json({
            message: "success",
            payload: allEvents
        })

    }catch(e){
        res.status(500).json({
            message: "error",
            error: e.message
        })
    }
}

async function getOneEvent(req, res) {
    try{
        let foundEvent = await Event.findById(req.params.id)
        .populate('host')
        .populate('attendees')

        res.json({
            message: "success",
            payload: foundEvent
        })

    }catch(e){
        res.status(500).json({
            message: "error",
            error: e.message
        })
    }
}

module.exports = {
    createEvent,
    deleteEvent,
    getAllEvents,
    getOneEvent
}