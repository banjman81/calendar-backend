const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        content : {
            type : String,
        },
        user : {
            type : mongoose.Schema.ObjectId,
            ref: "user"
        },
        gameId : {
            type : Number
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("comment", commentSchema)