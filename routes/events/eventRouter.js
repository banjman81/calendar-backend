const express = require('express')

const router = express.Router()

const {userAuthenticator, checkIsEmpty, validateCreateEventData} = require('../lib/index')
const {createEvent, deleteEvent} = require('./controller/eventController')

router.post('/create-event', userAuthenticator, checkIsEmpty, validateCreateEventData, createEvent)
router.delete('/delete-event/:id', userAuthenticator, deleteEvent)

module.exports = router;

