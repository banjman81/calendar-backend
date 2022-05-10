const jwt = require('jsonwebtoken')

function userAuthenticator(req, res, next){
    try{
        if(req.headers && req.headers.authorization) {
            let rawToken = req.headers.authorization;

            let slicedToken = rawToken.slice(7);

            let decodedToken = jwt.verify(slicedToken, process.env.JWT_USER_SECRET)

            res.locals.decodedData = decodedToken
            // console.log("good")
            next()
        } else{
            console.log("baduser")
            throw({message: "You do not have permission"})
        }

    }catch(e){
        res.status(500).json({
            message: "ERROR-AUTH",
            error: e.message
        })
    }
}

module.exports = {userAuthenticator}