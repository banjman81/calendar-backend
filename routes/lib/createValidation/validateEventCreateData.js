const {} = require('validator')

const d = new Date();
const NoTimeDate = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear(); // get the 8 digit date without time

function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function validateCreateEventData(req, res, next){

    let errObj = {}
    let {title, eventType, shortDescription, longDescription, location, startDate, endDate, capacity} = req.body

    
    console.log( "location:", location)
    if(title.length < 8){
        errObj.title = "Title is too short. Needs to be 8 characters or more."
    }
    if(eventType.length < 3){
        errObj.eventType = "Event type is too short."
    }
    if(shortDescription.length < 15){
        errObj.shortDescription = "Short description needs more information. Needs to be 15 characters or more."
    }
    if(longDescription.length < 50){
        errObj.longDescription = "Description is too short. Needs to be 50 characters or more."
    }
    if(location !==  "Remote"){
        if(location.length < 15)
        errObj.location = "Please enter a proper address."
    }
    if(getNumberOfDays(NoTimeDate, startDate) < 1){
        if(getNumberOfDays(NoTimeDate, startDate) === 0){
            errObj.startDate = "You cannot make an event today."
        }else{
            errObj.startDate = "Invalid start date."
        }
        
    }else{
        if(getNumberOfDays(startDate, endDate) < 0){
            errObj.endDate = "Invalid end date."
        }else{
            if(getNumberOfDays(startDate, endDate) > 30){
                errObj.endDate = "Event cannont be longer than 30 days."
            }
        }
        
    }
    if(capacity < 2){
        errObj.capacity = "You cannot make a solo event."
    }

    if(Object.keys(errObj).length > 0){
        return res.status(500).json({
            message: "error",
            error: errObj
        })
    }else{
        req.body.duration = String(getNumberOfDays(startDate, endDate)+1)
        next()
    }
}

module.exports = {
    validateCreateEventData,
    getNumberOfDays
}