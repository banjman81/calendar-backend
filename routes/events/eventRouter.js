const express = require('express')

const router = express.Router()

const {userAuthenticator, checkIsEmpty} = require('../lib/index')
const {createEvent} = require('./controller/eventController')

router.post('/create-event', userAuthenticator, checkIsEmpty, createEvent)

module.exports = router;

