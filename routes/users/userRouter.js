const express = require('express')

const router = express.Router()

const {checkIsEmpty, validateCreateData, validateLoginData, userAuthenticator} = require('../lib/index')
const {createUser, login, getUserByEmail, deleteUser, addEvent} = require('./controller/userController')

router.get("/", function(req, res, next){
    res.json({
        success: "Success",
        message: 'user home'
    })
})

router.post('/create-user', checkIsEmpty, validateCreateData, createUser)
router.post('/login', checkIsEmpty, validateLoginData, login)
router.get('/getUserByEmail/:email', getUserByEmail)
router.delete('/delete-user', userAuthenticator, deleteUser)
router.post('/add-event/:id', userAuthenticator, addEvent)

module.exports =  router;