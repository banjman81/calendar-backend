const express = require('express')

const router = express.Router()

router.get("/", function(req, res, next){
    res.json({
        success: "Success",
        message: 'user home'
    })
})

router.post('/create-user', function(req, res, next){
    res.json({
        success: "Success",
        message: 'create user',
        payload: req.body
    })
})

module.exports =  router;