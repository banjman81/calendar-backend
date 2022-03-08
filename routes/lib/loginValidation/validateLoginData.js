const {isEmail} = require('validator')

function  validateLoginData(req, res, next){
    const {email} =  req.body

    let errObj = {}

    if(!isEmail(email)){
        errObj.email = ' Please enter a valid email'
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
    validateLoginData,
}