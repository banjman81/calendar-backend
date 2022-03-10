const express = require('express')

const router = express.Router()

const {userAuthenticator, checkIsEmpty, validateCreateEventData} = require('../lib/index')
const {createEvent, deleteEvent, getAllEvents} = require('./controller/eventController')

router.get('/', getAllEvents)
router.post('/create-event', userAuthenticator, checkIsEmpty, validateCreateEventData, createEvent)
router.delete('/delete-event/:id', userAuthenticator, deleteEvent)

module.exports = router;

