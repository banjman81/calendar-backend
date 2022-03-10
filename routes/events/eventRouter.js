const express = require('express')

const router = express.Router()

const {userAuthenticator, checkIsEmpty, validateCreateEventData} = require('../lib/index')
const {createEvent} = require('./controller/eventController')

router.post('/create-event', userAuthenticator, checkIsEmpty, validateCreateEventData, createEvent)

module.exports = router;

