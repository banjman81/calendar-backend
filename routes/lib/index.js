const {checkIsEmpty} = require('./sharedValidation/checkIsEmpty')
const {validateCreateData} = require('./createValidation/validateCreateData')
const {validateLoginData} = require('./loginValidation/validateLoginData')
const {userAuthenticator} = require('./sharedValidation/userAuthenticator')
const {validateCreateEventData} = require('./createValidation/validateEventCreateData')

module.exports = {
    checkIsEmpty,
    validateCreateData,
    validateLoginData,
    userAuthenticator,
    validateCreateEventData
}