const User = require('../../users/model/User')
const Event = require('../model/Event')


async function createEvent(req, res) {
    
    const decodedData = res.locals.decodedData
    console.log('create event')
    try{

        let {title, eventType, shortDescription, longDescription, location, startDate, endDate, duration, capacity,} = req.body

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
            host : foundUser._id
        })

        let savedEvent = await createdEvent.save()

        res.json({
            message: 'success',
            payload: createdEvent
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
        const foundEvent = await Event.findById(req.params.id)

        if(String(foundUser._id) === String(foundEvent.host._id)){

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

module.exports = {
    createEvent,
    deleteEvent
}