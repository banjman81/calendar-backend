const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required : true
        },
        eventType: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        longDescription: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required : true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        duration:{
            type: String,
            required: true
        },
        capacity: {
            type: String,
            required: true
        },
        attendees: [{
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }],
        host: {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        },
        comments : [{
            type : mongoose.Schema.ObjectId,
            ref: "comment"
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("event", eventSchema)