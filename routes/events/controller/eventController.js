const User = require('../../users/model/User')
const Event = require('../model/Event')


async function createEvent(req, res) {
    
    const decodedData = res.locals.decodedData
    console.log('create event')
    try{

        let {title, eventType, shortDescription, longDescription, location, startDate, endDate, capacity} = req.body

        const foundUser = await User.findOne({email: decodedData.email})

        const createdEvent = new Event({
            title,
            eventType,
            shortDescription,
            longDescription,
            location,
            startDate,
            endDate,
            capacity,
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

module.exports = {
    createEvent
}