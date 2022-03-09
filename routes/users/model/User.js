const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required : true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        comments : [{
            type : mongoose.Schema.ObjectId,
            ref: "comment"
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('user', userSchema)