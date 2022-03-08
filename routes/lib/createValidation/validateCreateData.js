const {isAlpha, isAlphanumeric, isEmail, isStrongPassword} = require('validator')

function validateCreateData(req, res, next){
    const { firstName, lastName, username, email, password, confirmPassword } = req.body
    let errObj = {}


    if(!isAlpha(firstName)){
        errObj.firstName = 'First name cannot have special characters or numbers'
    }

    if(!isAlpha(lastName)){
        errObj.lastName = 'Last name cannot have special characters or numbers'
    }

    if(!isAlphanumeric(username)){
        errObj.username = 'Username cannot have any special characters'
    }

    if(!isEmail(email)){
        errObj.email = 'Invalid email format!'
    }

    if(!isStrongPassword(password)){
        errObj.password = 'Weak password! Please try a different one'
    }else{
        if(password !== confirmPassword){
            errObj.password = 'Password does not match'
        }
    }

    if (Object.keys(errObj).length > 0){
        return res.status(500).json({
            message: "error",
            error: errObj
        })
    }
    else{
        next()
    }
}

module.exports = {
    validateCreateData,
}